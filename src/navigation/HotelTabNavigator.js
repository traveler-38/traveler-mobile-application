import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

import HotelHome from "../screens/hotelOwner/HotelOwnerHome";
// import Map from "../screens/maps/main_map";
import colors from "../assets/asse/colors/colors";
import prePlanTripData from "../screens/pre-define-trip/preDefineTrips";
import HotelProfile from "../screens/hotelOwner/HotelProfile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const HotelTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: styles.tabBar,
        activeTintColor: colors.white,
        inactiveTintColor: colors.white,
        showLabel: false,
      }}
      initialRouteName={"HotelHome"}
    >
      <Tab.Screen
        name="prePlanTripData"
        component={prePlanTripData}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="clipboard" size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HotelHome"
        component={HotelHome}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={32} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="HotelProfile"
        component={HotelProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="user" size={32} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.blue,
  },
});

export default HotelTabNavigator;
