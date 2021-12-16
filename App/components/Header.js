import React from "react";
import { View } from "react-native";
import { Appbar, Colors, Menu } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

const ICON_SIZE = 25;
const TITLE_SIZE = 13;

const Header = ({ navigation, back }) => {
  const route = useRoute();
  const [visible, setVisible] = React.useState(false);

  const _openDrawer = () => navigation.openDrawer();

  const _getTitle = () => {
    if (route.name === "Home") {
      return "Accueil";
    } else if (route.name === "AddPerson") {
      return "Ajouter Client";
    } else if (route.name === "EditPerson") {
      return "Modifier Client";
    } else if (route.name === "Search") {
      return "Rechercher";
    } else if (route.name === "PersonCredits") {
      let nom = route.params.nom;
      if (nom) {
        if (nom.length > TITLE_SIZE) {
          return nom.slice(0, TITLE_SIZE) + "...";
        }
        return nom;
      } else {
        return "Credits Person";
      }
    } else if (route.name === "AddCredits") {
      return "Ajouter Credit";
    } else if (route.name === "EditCredits") {
      return "Modifier Credit";
    }
  };

  return (
    <Appbar.Header style={{ backgroundColor: Colors.orange600 }}>
      {back && route.name === "PersonCredits" ? (
        <Appbar.BackAction
          color={Colors.white}
          size={ICON_SIZE}
          onPress={() => navigation.navigate("Home")}
        />
      ) : back && route.name !== "PersonCredits" ? (
        <Appbar.BackAction
          size={ICON_SIZE}
          color={Colors.white}
          onPress={navigation.goBack}
        />
      ) : (
        <Appbar.Action
          icon="menu"
          size={ICON_SIZE}
          onPress={_openDrawer}
          color={Colors.white}
        />
      )}
      <Appbar.Content title={_getTitle()} color={Colors.white} />
      {/* add buttons */}
      {route.name === "Home" ? (
        <Appbar.Action
          icon="account-plus"
          color={Colors.white}
          size={ICON_SIZE}
          onPress={() => navigation.navigate("AddPerson")}
        />
      ) : route.name === "PersonCredits" ? (
        <Appbar.Action
          icon="cash-plus"
          color={Colors.white}
          size={ICON_SIZE}
          onPress={() =>
            navigation.navigate("AddCredits", { id: route.params.id })
          }
        />
      ) : null}
    </Appbar.Header>
  );
};

export default Header;
{
  /* <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Appbar.Action
    icon="cash-plus"
    color={Colors.white}
    size={ICON_SIZE}
    onPress={() =>
      navigation.navigate("AddCredits", { id: route.params.id })
    }
  />
  <Menu
    visible={visible}
    onDismiss={() => setVisible(false)}
    anchor={
      <Appbar.Action
        icon="dots-vertical"
        color={Colors.white}
        onPress={() => setVisible(true)}
      />
    }
  >
    <Menu.Item
      onPress={deleteAllCredits}
      title="Supprimer tous"
      icon="trash-can"
    />
    <Menu.Item
      onPress={rafraichirCredits}
      title="Rafraîchir"
      icon="reload"
    />
  </Menu>
</View> */
}
