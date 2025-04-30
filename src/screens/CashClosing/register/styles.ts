import { Button, Heading } from "native-base";
import { styled } from 'dripsy'
import { View, TextInput } from "react-native";
export const Container = styled.View`
padding: 8px;
display: 'grid';
`;

export const Input = styled.TextInput`
border: 1px solid #510996;
border-width: 1;
padding: 10px;
margin: 10px;
color: white;
`;

export const Title = styled(Heading)`
color: white;
margin-top: 20;
`;

export const Register = styled(Button)`
margin: 14px;
height: 55px;
border-radius: 18px;
color: #fff;
background-color: #510996;
`;