import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import { Colors } from "react-native-paper";

const ICON_SIZE = 24;

const ListPersons = ({
  listData,
  toCredits,
  details,
  edit,
  remove,
  share,
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
      onPress={() => toCredits(item.nom, item.id)}
      onLongPress={() => details(item)}
      style={styles.rowFront}
      underlayColor={Colors.grey200}
    >
      <View>
        <Text>{item.nom}</Text>
      </View>
    </TouchableHighlight>
  );

  const HiddenItem = ({ item }, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backBtn, styles.backLeftBtnLeft]}
        onPress={() => share(rowMap, item)}
      >
        <MaterialCommunityIcons
          color={Colors.white}
          name="share"
          size={ICON_SIZE}
        />
      </TouchableOpacity>

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
    backgroundColor: Colors.green600,
    left: 0,
  },
});

export default ListPersons;
