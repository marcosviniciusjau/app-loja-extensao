import { TouchableOpacityProps } from "react-native";
import { Container, CashClosingText } from "./styles";
import React from "react";
import { CashClosing } from "@dtos/CashClosing";
import { ButtonIcon } from "@components/ButtonIcon";
import dayjs from "dayjs";

type Props = TouchableOpacityProps & {
  onDelete: () => void;
  item: CashClosing;
};

export function CashClosingCard({ item, onDelete, ...rest }: Props) {
  console.log("dinovo", item);
  return (
    <Container {...rest}>
      <CashClosingText>
        {dayjs(item.createdAt).format("DD/MM/YYYY")}
      </CashClosingText>
      <CashClosingText>
        {" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.total)}
      </CashClosingText>
      <CashClosingText>{item.type}</CashClosingText>
      <ButtonIcon icon="trash" color={"#fff"} onPress={onDelete} />
    </Container>
  );
}
