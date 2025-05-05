import { TouchableOpacity, Text } from "react-native"
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)({
  display: 'flex',
  gap: '15px',
  flexDirection: 'row',
  padding: '12px',
  margin: ' 14px',
  borderRadius: '14px',
  backgroundColor: '#510996',
})

export const Form = styled(TouchableOpacity)({
  display: 'flex',
  gap: '15px',
  flexDirection: 'row',
  padding: '12px',
  margin: '14px',
  borderRadius: '14px',
  backgroundColor: '#510996',
})

export const CashClosingText = styled(Text)({
  color: '#fff',
  fontSize: '16px',
})
