import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RegisterCashClosing } from "@screens/CashClosing/register";
import { ListWeek } from "@screens/CashClosing/list-week";
import { ListMonth } from "@screens/CashClosing/list-month";
import { Sum } from "@screens/CashClosing/sum";

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
        component={ListWeek}
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
        component={ListMonth}
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
        name="Relatório"
        component={Sum}
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
