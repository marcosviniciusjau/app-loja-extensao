import styled from "styled-components/native";

import { Heading, VStack } from "native-base"

export const Main = styled(VStack)({
  maxWidth: '100%',
  margin: '15px',
  gap: '5px',
})

export const Container = styled(VStack)({
  display: 'flex',
  gap: '5px',
  padding: '24px',
  flexDirection: 'column'
})


export const Title = styled(Heading)({
  color: ' #FF3131',
  marginTop: 10
})

export const Sums = styled(Heading)({
  color: 'white',
  fontStyle: 'bold',
  fontWeight: 400,
  marginTop: 20,
})
