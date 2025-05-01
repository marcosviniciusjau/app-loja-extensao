import { Button, Heading } from "@gluestack-ui/themed"
import { styled } from 'dripsy'
import { View, TextInput } from "react-native"

export const Container = styled(View)({
  padding: '8px',
  display: 'grid',
})

export const Input = styled(TextInput)({
  borderColor: ' #510996',
  borderWidth: 1,
  padding: '10px',
  margin: '10px',
  color: 'white',
})

export const Title = styled(Heading)({
  color: 'white',
  marginTop: '20',
})

export const Register = styled(Button)({
  margin: '14px',
  height: '55px',
  borderRadius: '18px',
  color: '#fff',
  backgroundColor: '#510996',
})

