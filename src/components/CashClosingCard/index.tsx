import { TouchableOpacityProps } from "react-native";
import { Container, CashClosingText } from "./styles";
import { Text } from "native-base";
import React from "react";
import { CashClosing } from "@dtos/CashClosing";
type Props = TouchableOpacityProps & {
  isSameDay: boolean;
  item: CashClosing;
};
export function CashClosingCard({ item, isSameDay, ...rest }: Props) {
  return (
    <Container {...rest} isSameDay={isSameDay}>
      <CashClosingText>{item.date}</CashClosingText>
      <CashClosingText>{item.total}</CashClosingText>
      <CashClosingText>{item.type}</CashClosingText>
    </Container>
  );
}
