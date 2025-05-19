import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
type Props = TouchableOpacityProps & {
  icon: keyof typeof FontAwesome.glyphMap;
  color: string;
};

export function ButtonIcon({ icon, onPress, color, ...rest }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...rest}
    >
      <FontAwesome name={icon} size={25} color={color} />
    </TouchableOpacity>
  );
}
