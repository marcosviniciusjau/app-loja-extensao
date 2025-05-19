import { TouchableOpacity, Text } from "react-native"
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)({
  display: 'flex',
  gap: '8px',
  flexDirection: 'row',
  padding: '14px',
  margin: '5px',
  borderRadius: '14px',
  backgroundColor: '#FF3131',
})

export const ContainerUpdate = styled(TouchableOpacity)({
  display: 'flex',
  gap: '6px',
  flexDirection: 'column',
  padding: '12px',
  margin: ' 7px',
  borderRadius: '14px',
  backgroundColor: '#FF3131',
})

export const CashClosingText = styled(Text)({
  color: '#fff',
  fontSize: '16px',
})
