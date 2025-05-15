import React, { useEffect } from "react";
import { Routes } from "./src/routes";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import theme from "@theme/index";

import { PermissionsAndroid, Platform, useColorScheme } from "react-native";
export default function App() {
  const colorScheme = useColorScheme();
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Routes />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
