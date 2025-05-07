import { TouchableOpacity, Text } from "react-native"
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)({
  display: 'flex',
  gap: '15px',
  flexDirection: 'row',
  padding: '12px',
  margin: ' 7px',
  borderRadius: '14px',
  backgroundColor: '#FF3131',
})


export const CashClosingText = styled(Text)({
  color: '#fff',
  fontSize: '16px',
})
