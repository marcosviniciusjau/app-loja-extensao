import { Alert, Text } from "react-native"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, SectionList } from "react-native"
import { db } from "@db/index"
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing"
import { useEffect, useState } from "react"
import React from "react"
import zod from "zod"
import dayjs from "dayjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Container, Input, Register, Title } from "./styles"
import { CashClosingCard } from "@components/CashClosingCard"
import { CashClosingText } from "@components/CashClosingCard/styles"
import { addCashClosing, deleteCashClosing } from "@dao/CashClosingDAO"
import { ScrollView } from "native-base"

const cashClosingBody = zod.object({
  total: zod.coerce.number().positive("Informe um valor positivo"),
  type: zod.string().min(1, "Informe um tipo"),
})

export type CashClosingFormData = zod.infer<typeof cashClosingBody>

export function RegisterCashClosing() {
  const [DATA, setDATA] = useState<CashClosingDTO[]>([])

  const [sum, setSum] = useState(0)
  const now = dayjs().format("DD/MM/YYYY")
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CashClosingFormData>({
    resolver: zodResolver(cashClosingBody),
  })

  async function registerCashClosing(data: CashClosingFormData) {
    try {
      //@ts-ignore
      addCashClosing(data)
    } catch (error) {
      console.error(error)
    }

    reset()
    loadData()
  }

  async function handleRemoveCashClosing(id: string) {
    try {
      Alert.alert("Confirmação", "Deseja realmente excluir?", [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            deleteCashClosing(id)
            loadData()
          },
        },
      ])
    } catch (error) {
      console.log(error)

      Alert.alert(
        "Remover fechamento",
        "Não foi possível remover esse fechamento."
      )
    }
  }
  function loadData() {
    const results = db
      .objects<CashClosingDTO>("CashClosingSchema")
      .filtered("date == $0", now)
    setDATA(Array.from(results))

    const calculateSum = results.reduce((acc, item) => acc + item.total, 0)
    setSum(calculateSum)
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <ScrollView>
      <Container>
        <CashClosingText>Total</CashClosingText>
        <Controller
          control={control}
          name="total"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="0.0"
              keyboardType="decimal-pad"  
              value={value ?? ''}
              onChangeText={onChange}
            />
          )}
        />
        {errors.total && (
          <Text style={styles.error}>{errors.total.message}</Text>
        )}
        <CashClosingText>Tipo</CashClosingText>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Se foi pix, cartão ou despesa"
              onChangeText={onChange}  
              value={value ?? ''}
            />
          )}
        />
        {errors.type && <Text style={styles.error}>{errors.type.message}</Text>}
        <Register
          onPress={handleSubmit(registerCashClosing)}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          <CashClosingText>Registrar</CashClosingText>
        </Register>
        <SectionList
          sections={[{ title: "Fechamentos do dia", data: DATA }]}
          ListEmptyComponent={<Text>Não tem nada ainda</Text>}
          renderItem={({ item }) => (
            <CashClosingCard
              item={item}
              onDelete={() => handleRemoveCashClosing(item.id)}
            />
          )}
        />{" "}
        <Title>
          Total do dia:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(sum)}
        </Title>
      </Container>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
  },
})
