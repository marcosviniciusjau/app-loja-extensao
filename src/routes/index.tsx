import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Graphs } from '@screens/Graphs';
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import {RegisterCashClosing} from "@screens/CashClosing/register";
import {ListCashClosing} from "@screens/CashClosing/list";
const { Navigator, Screen } = createBottomTabNavigator();
export function Routes() {
  return (
    <Navigator>
      <Screen name="Home" component={RegisterCashClosing} />
      <Screen name="Listar com Gráficos" component={Graphs} />
      <Screen name="Lista Mensal" component={ListCashClosing} />
    </Navigator>
  );
}
