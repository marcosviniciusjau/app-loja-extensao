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
padding: 12px;
margin: 14px;
border-radius: 14px;
background-color:#510996;
`

export const CashClosingText = styled(Text)`
color: #fff;
font-size: 16px;
`;