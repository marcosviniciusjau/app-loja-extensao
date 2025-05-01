//@ts-nocheck

import { FontAwesome } from "@expo/vector-icons"
import { TouchableOpacityProps } from "react-native"

import { Container, Icon } from "./styles"
import React from "react"

type Props = TouchableOpacityProps & {
  icon: keyof typeof FontAwesome.glyphMap
  color: string
};

export function ButtonIcon({ icon, color, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Icon name={icon} size={30} color={color} />
    </Container>
  );
}
