import React from 'react'
import { Center, Spinner } from "native-base"

export function Loading(){
  return (
    <Center flex={1} bg="gray.700">
      <Spinner color="#FF3131" />
    </Center>
  )
}