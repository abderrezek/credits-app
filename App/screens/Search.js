import React from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const _goBack = () => navigation.pop();

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.search}
        placeholder="Rechercher ici..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        icon="arrow-left"
        onIconPress={_goBack}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="account-search"
              size={70}
              color="gray"
            />
            <Text style={{ fontSize: 18 }}>Rechercher</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Search;
