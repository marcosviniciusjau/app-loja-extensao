import { Button, TextInput, Text } from "react-native";

import { StyleSheet, View, SectionList } from "react-native";
import React from "react";
import {useNavigation} from '@react-navigation/native'

export function Home() {
 const navigation = useNavigation()
 async function goCashClosing(){
  navigation.navigate('cashClosing')
 }

  return (
    <>
  
      <Button
        title="Registrar Venda"
        onPress={goCashClosing}
      />

   
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
  },
  error: {
    color: "red",
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
  },
});
