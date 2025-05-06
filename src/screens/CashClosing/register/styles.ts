import styled from "styled-components/native";
import { TextInput, View } from "react-native"

import { Heading, Text, Button } from "native-base"

export const Container = styled(View)({
  padding: '8px',
  display: 'grid',
})

export const Input = styled(TextInput)({
  borderColor: '#FF3131',
  borderWidth: 1,
  padding: '10px',
  margin: '10px',
  color: 'white',
})

export const Title = styled(Heading)({
  color: 'white',
  marginTop: '20',
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
  backgroundColor: '#FF3131',
})

