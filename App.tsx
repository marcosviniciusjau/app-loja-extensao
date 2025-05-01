import React from "react"
import "@/global.css"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { Routes } from "./src/routes"
import { NavigationContainer} from "@react-navigation/native"
import { RealmProvider } from "@realm/react"
import { db } from "@db/index"

export default function App() {
  return (
    <RealmProvider schema={db.schema}>
      <GluestackUIProvider mode="dark">
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </GluestackUIProvider>
    </RealmProvider>
  );
}
