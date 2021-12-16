import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "react-native-paper";

import Home from "../screens/Home";
import Settings from "../screens/Settings";
import About from "../screens/About";
import AddPerson from "../screens/AddPerson";
import EditPerson from "../screens/EditPerson";
import Search from "../screens/Search";
import PersonCredits from "../screens/PersonCredits";
import AddCredits from "../screens/AddCredits";
import EditCredits from "../screens/EditCredits";
import Header from "../components/Header";

const StackNavigator = createStackNavigator();
const StackHome = () => (
  <StackNavigator.Navigator
    initialRouteName={Home}
    screenOptions={{ header: (props) => <Header {...props} /> }}
  >
    <StackNavigator.Group>
      <StackNavigator.Screen name="Home" component={Home} />
    </StackNavigator.Group>

    <StackNavigator.Group screenOptions={{ presentation: "modal" }}>
      <StackNavigator.Screen name="AddPerson" component={AddPerson} />
      <StackNavigator.Screen name="EditPerson" component={EditPerson} />
      <StackNavigator.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <StackNavigator.Screen name="PersonCredits" component={PersonCredits} />
      <StackNavigator.Screen name="AddCredits" component={AddCredits} />
      <StackNavigator.Screen name="EditCredits" component={EditCredits} />
    </StackNavigator.Group>
  </StackNavigator.Navigator>
);

const DrawerNavigator = createDrawerNavigator();
const Drawer = () => (
  <DrawerNavigator.Navigator initialRouteName="StackHome">
    <DrawerNavigator.Screen
      name="StackHome"
      component={StackHome}
      options={{
        title: "Accueil",
        drawerIcon: () => <MaterialIcons name="home" size={24} color="black" />,
        headerShown: false,
      }}
    />

    <DrawerNavigator.Screen
      name="Settings"
      component={Settings}
      options={{
        title: "Paramètres",
        drawerIcon: () => (
          <MaterialIcons name="settings" size={24} color="black" />
        ),
        headerStyle: { backgroundColor: Colors.orange600 },
        headerTintColor: Colors.white,
      }}
    />

    <DrawerNavigator.Screen
      name="About"
      component={About}
      options={{
        title: "À propos",
        drawerIcon: () => (
          <MaterialIcons name="info-outline" size={24} color="black" />
        ),
        headerStyle: { backgroundColor: Colors.orange600 },
        headerTintColor: Colors.white,
      }}
    />
  </DrawerNavigator.Navigator>
);

export default () => (
  <NavigationContainer>
    <Drawer />
  </NavigationContainer>
);
