import { Container, Icon } from "native-base";
import React from "react";
import { TouchableOpacityProps } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
type Props = TouchableOpacityProps & {
  icon: keyof typeof FontAwesome.glyphMap;
  color: string;
};

export function ButtonIcon({ icon, color, ...rest }: Props) {
  return (
    <Container {...rest}>
      <FontAwesome name={icon} size={30} color={color} />
    </Container>
  );
}
