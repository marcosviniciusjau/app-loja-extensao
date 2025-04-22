import React from 'react';
import {Routes} from './src/routes';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { db } from '@db/index';
export default function App() {
  return (  
  <RealmProvider schema={db.schema}>
    <NavigationContainer>
       <Routes />
    </NavigationContainer>
    </RealmProvider>
   
  );
}
