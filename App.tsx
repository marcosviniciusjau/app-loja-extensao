import React from "react";
import { Routes } from "./src/routes";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { RealmProvider } from "@realm/react";
import { db } from "@db/index";
import { NativeBaseProvider, useTheme } from "native-base";
import theme from "@theme/index";

export default function App() {
  //const theme = useTheme()
  return (
    <NativeBaseProvider theme={theme}>
      <RealmProvider schema={db.schema}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </RealmProvider>
    </NativeBaseProvider>
  );
}
