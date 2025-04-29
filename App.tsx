import React from "react"
import { Routes } from "./src/routes"
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { RealmProvider } from "@realm/react"
import { db } from "@db/index"
import { NativeBaseProvider, useTheme } from "native-base"
import theme from "@theme/index"

import { useColorScheme } from "react-native"
export default function App() {
  const colorScheme = useColorScheme()

  return (
    <RealmProvider schema={db.schema}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer
          theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Routes />
        </NavigationContainer>
      </NativeBaseProvider>
    </RealmProvider>
  );
}
