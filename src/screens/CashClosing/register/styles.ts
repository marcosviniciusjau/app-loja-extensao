import styled from "styled-components/native";
import { TextInput, View } from "react-native"

import { Heading, Text, Button, VStack, Select } from "native-base"

export const Container = styled(View)({
  padding: '8px',
  display: 'grid',
})

export const DateContainer = styled(View)({
  flexDirection: "row",
  alignItems: "center",
  borderColor: "#FF3131",
  borderWidth: 1,
  padding: 10,
  gap: 20,
  margin: 10,
  width: "45%",
  height: "6%",
  borderRadius: 5,
})

export const Input = styled(TextInput)({
  borderColor: '#FF3131',
  borderWidth: 1,
  padding: '10px',
  margin: '10px',
  color: 'white',
})

export const InputDate = styled(TextInput)({
  borderWidth: 1,
  color: 'white',
})

export const Options = styled(Select)({
  borderWidth: 1,
  color: 'white',
})

export const Items = styled(Select.Item)({
  backgroundColor: '#000',
  color: 'white',
})

export const Title = styled(Heading)({
  color: 'white',
  marginTop: '5',
  fontSize: 'lg'
})

export const CashClosingText = styled(Text)({
  color: '#fff',
  fontSize: '16px',
})

export const Register = styled(Button)({
  margin: '14px',
  height: '55px',
  borderRadius: '18px',
  color: '#fff',

  backgroundColor: '#0b5cff',
})

