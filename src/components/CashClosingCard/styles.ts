import { TouchableOpacity } from "react-native";
import { styled } from 'dripsy'
import { Text } from "native-base";

export const Container = styled(TouchableOpacity)`
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