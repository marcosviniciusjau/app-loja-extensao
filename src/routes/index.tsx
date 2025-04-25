import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { RegisterCashClosing } from "@screens/CashClosing/register";
import { ListWeekCashClosing } from "@screens/CashClosing/list-week";
import { ListMonthCashClosing } from "@screens/CashClosing/list-month";
import { FontAwesome } from '@expo/vector-icons';
const { Navigator, Screen } = createBottomTabNavigator();
export function Routes() {
  return (
    <Navigator>
      <Screen
        name="Home"
        component={RegisterCashClosing}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={"#510996"}/>,
        }}
      />
      <Screen
        name="Lista Semanal"
        component={ListWeekCashClosing}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={"#510996"}/>,
        }}
      />
      <Screen
        name="Lista Mensal"
        component={ListMonthCashClosing}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="money" size={24} color={"#510996"}/>,
        }}
      />
    </Navigator>
  );
}
