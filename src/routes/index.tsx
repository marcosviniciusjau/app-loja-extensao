import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { RegisterCashClosing } from "@screens/CashClosing/register";
import { ListWeekCashClosing } from "@screens/CashClosing/list-week";
import { ListMonthCashClosing } from "@screens/CashClosing/list-month";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "native-base";
const { Navigator, Screen } = createBottomTabNavigator();
export function Routes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];
  return (
    <Navigator>
      <Screen
        name="Home"
        component={RegisterCashClosing}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
          tabBarLabelStyle: { fontSize: sizes[4] },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={iconSize} color={"#510996"} />
          ),
        }}
      />
      <Screen
        name="Lista Semanal"
        component={ListWeekCashClosing}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
          tabBarLabelStyle: { fontSize: sizes[4] },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={iconSize} color={"#510996"} />
          ),
        }}
      />
      <Screen
        name="Lista Mensal"
        component={ListMonthCashClosing}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
          tabBarLabelStyle: { fontSize: sizes[4] },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="money" size={iconSize} color={"#510996"} />
          ),
        }}
      />
    </Navigator>
  );
}
