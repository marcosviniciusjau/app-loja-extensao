import { TouchableOpacityProps } from "react-native"
import { Container, CashClosingText } from "./styles"
import React from "react"
import { CashClosing } from "@dtos/CashClosing"
import { ButtonIcon } from "@components/ButtonIcon"

type Props = TouchableOpacityProps & {
  onDelete: () => void
  item: CashClosing
}

export function CashClosingCard({ item, onDelete, ...rest }: Props) {
  return (
    <Container {...rest}>
      <CashClosingText>{item.date}</CashClosingText>
      <CashClosingText>
        {" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.total)}
      </CashClosingText>
      <CashClosingText>{item.type}</CashClosingText>     
       <ButtonIcon icon="trash" color={'#fff'} onPress={onDelete} />
    </Container>
  );
}