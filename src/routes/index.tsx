import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import {RegisterCashClosing} from "@screens/CashClosing/register";
import {ListCashClosing} from "@screens/CashClosing/list";
const { Navigator, Screen } = createBottomTabNavigator();
export function Routes() {
  return (
    <Navigator>
      <Screen name="Home" component={Home} />
      <Screen name="Registrar Fechamento" component={RegisterCashClosing} />
      <Screen name="Lista de Fechamentos" component={ListCashClosing} />
    </Navigator>
  );
}
