import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Text } from "native-base";
type ContainerProps = {
  isSameDay: boolean
}
export const Container = styled(TouchableOpacity) <ContainerProps>`
display: flex;
gap: 15px;
flex-direction: row;
width: '100%';
padding: 22px;
margin: 24px;
border-radius: 14px;
background-color:#0056b3;
`

export const CashClosingText = styled(Text)`
color: #fff;
font-size: 16px;
`;