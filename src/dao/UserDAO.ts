import { UserDTO } from "@dtos/UserDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "src/db";

export async function addUser(user: UserDTO){
  await AsyncStorage.setItem("user", JSON.stringify(user));
}

export async function getUser(user: UserDTO){
  const storage = await AsyncStorage.getItem("user");
  const userStorage = storage ?JSON.parse(storage) : {} as UserDTO;
  return userStorage;
}

export async function removeUser(){
  await AsyncStorage.removeItem("user");
}


