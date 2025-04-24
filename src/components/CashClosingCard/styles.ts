import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Text } from "native-base";
export const Container = styled(TouchableOpacity)`
display: flex;
width: '100%';
padding: 24px;
border-radius: 14px;
background-color: #510996;
variants: {
  isSameDay: {
      true: {
        display: 'flex';
        flexDirection: 'column';
        gap: '0.75rem';
        width: '100%';
        height: 'auto';
      };
    };
  };
`

export const CashClosingText = styled(Text)`
color: #fff;
font-size: 16px;
`;