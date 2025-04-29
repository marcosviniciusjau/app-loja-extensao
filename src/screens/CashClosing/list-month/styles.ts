import { Heading } from "native-base";
import styled from "styled-components/native";

export const Main = styled.View`
max-width: 100%;
margin: 15px;
gap: 5px;
`
export const Container = styled.View`
display: flex;
gap: 5px;
padding: 24px;
flex-direction: column;
`

export const Title = styled(Heading)`
color: #510996;
margin-top: 10;
`;

export const Sums = styled(Heading)`
color: white;
font-style: bold;
font-weight: 400;
margin-top: 20;
`;