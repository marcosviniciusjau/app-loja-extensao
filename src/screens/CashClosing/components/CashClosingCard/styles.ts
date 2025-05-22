import { TouchableOpacity, Text } from "react-native"
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)({
  display: 'flex',
  gap: 8,
  flexDirection: 'row',
  padding: 14,
  margin: 5,
  borderRadius: 14,
  minWidth: 340,
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const ContainerUpdate = styled(TouchableOpacity)({
  display: 'flex',
  gap: '6px',
  flexDirection: 'column',
  padding: '12px',
  margin: ' 7px',
  borderRadius: '14px',
})

export const CashClosingText = styled(Text)({
  color: '#fff',
  fontSize: '16px',
})
