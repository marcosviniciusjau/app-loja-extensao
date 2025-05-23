import { View } from "react-native";
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

export const DateContainer = styled(View)({
  backgroundColor: '#00000000',
  borderColor: '#00000000',
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  paddingTop: 30,
  paddingBottom: 30,
  width: "45%",
  height: "6%",
  borderRadius: 5,
})

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
