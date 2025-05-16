import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RegisterCashClosing } from "@screens/CashClosing/register";
import { ListWeekCashClosing } from "@screens/CashClosing/list-week";
import { ListMonthCashClosing } from "@screens/CashClosing/list-month";

const { Navigator, Screen } = createBottomTabNavigator();
export function Routes() {
  const iconSize = 25;
  const mainColor = "#FF3131";
  return (
    <Navigator>
      <Screen
        name="Início"
        component={RegisterCashClosing}
        options={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#fff",
          tabBarLabelStyle: { fontSize: 15 },
          tabBarIcon: () => (
            <FontAwesome name="home" size={iconSize} color={mainColor} />
          ),
        }}
      />
      <Screen
        name="Semanal"
        component={ListWeekCashClosing}
        options={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#fff",
          tabBarLabelStyle: { fontSize: 15 },
          tabBarIcon: () => (
            <FontAwesome name="calendar" size={iconSize} color={mainColor} />
          ),
        }}
      />
      <Screen
        name="Mensal"
        component={ListMonthCashClosing}
        options={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#fff",
          tabBarLabelStyle: { fontSize: 15 },
          tabBarIcon: () => (
            <FontAwesome name="money" size={iconSize} color={mainColor} />
          ),
        }}
      />
    </Navigator>
  );
}
