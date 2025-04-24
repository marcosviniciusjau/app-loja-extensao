import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import {RegisterCashClosing} from "@screens/CashClosing/register";
import {ListWeekCashClosing} from "@screens/CashClosing/list-week";
import {ListMonthCashClosing} from "@screens/CashClosing/list-month";
const { Navigator, Screen } = createBottomTabNavigator();
export function Routes() {
  return (
    <Navigator>
      <Screen name="Home" component={RegisterCashClosing} />
      <Screen name="Lista Semanal" component={ListWeekCashClosing} />
      <Screen name="Lista Mensal" component={ListMonthCashClosing} />
    </Navigator>
  );
}
