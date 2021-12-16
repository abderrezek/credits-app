import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import { Colors } from "react-native-paper";

const ICON_SIZE = 24;

const ListCredits = ({
  listData,
  toCredit,
  details,
  edit,
  remove,
  enable,
  refreshing,
  onRefresh,
}) => {
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowOpen = (rowKey) => console.log("This row opened", rowKey);

  const Item = ({ item }) => (
    <TouchableHighlight
      onPress={() => toCredit(item)}
      onLongPress={() => details(item)}
      style={styles.rowFront}
      underlayColor={Colors.grey200}
    >
      <View style={styles.rowFrontContainer}>
        <Text>
          {item.date_achat}
          {item.est_payer === 0 && (
            <Text style={{ fontWeight: "500", fontSize: 16 }}>
              (
              {item.prix_attent === null
                ? item.prix
                : item.prix - item.prix_attent}{" "}
              DZD)
            </Text>
          )}
        </Text>

        {item.est_payer === 1 ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={ICON_SIZE}
            color={Colors.green300}
          />
        ) : (
          <MaterialCommunityIcons
            name="close-circle"
            size={ICON_SIZE}
            color={Colors.red300}
          />
        )}
      </View>
    </TouchableHighlight>
  );

  const HiddenItem = ({ item }, rowMap) => (
    <View style={styles.rowBack}>
      {/* enable */}
      <TouchableOpacity
        style={[
          styles.backBtn,
          styles.backLeftBtnLeft,
          {
            backgroundColor:
              item.prix_attent === null ? Colors.green600 : Colors.brown500,
          },
        ]}
        onPress={() => enable(rowMap, item)}
      >
        <MaterialCommunityIcons
          color={Colors.white}
          name="cash-refund"
          size={ICON_SIZE}
        />
      </TouchableOpacity>

      {/* edit */}
      <TouchableOpacity
        style={[styles.backBtn, styles.backRightBtnLeft]}
        onPress={() => edit(rowMap, item)}
      >
        <MaterialCommunityIcons
          color={Colors.white}
          name="account-edit"
          size={ICON_SIZE}
        />
      </TouchableOpacity>

      {/* remove */}
      <TouchableOpacity
        style={[styles.backBtn, styles.backRightBtnRight]}
        onPress={() => remove(rowMap, item)}
      >
        <MaterialCommunityIcons
          color={Colors.white}
          name="account-remove"
          size={ICON_SIZE}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={listData}
      renderItem={Item}
      renderHiddenItem={HiddenItem}
      leftOpenValue={75}
      rightOpenValue={-150}
      previewRowKey={"0"}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      onRowDidOpen={onRowOpen}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  rowFront: {
    alignItems: "center",
    backgroundColor: Colors.grey300,
    borderBottomColor: Colors.grey400,
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowFrontContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: Colors.grey100,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: Colors.blue600,
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: Colors.red600,
    right: 0,
  },
  backLeftBtnLeft: {
    // backgroundColor: Colors.green600,
    left: 0,
  },
});

export default ListCredits;
