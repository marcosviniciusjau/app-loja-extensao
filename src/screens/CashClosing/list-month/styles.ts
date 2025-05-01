import { Heading } from "@gluestack-ui/themed"
import { styled } from 'dripsy'

import { View } from "react-native"

export const Main = styled(View)({
  maxWidth: '100%',
  margin: '15px',
  gap: '5px',
})

export const Container = styled(View)({
  display: 'flex',
  gap: '5px',
  padding: '24px',
  flexDirection: 'column'
})


export const Title = styled(Heading)({
  color: ' #510996',
  marginTop: 10
})

export const Sums = styled(Heading)({
  color: 'white',
  fontStyle: 'bold',
  fontWeight: 400,
  marginTop: 20,
})
