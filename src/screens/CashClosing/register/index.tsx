import React from "react";
import zod from "zod";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, ScrollView, SectionList } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "native-base";
import { db } from "@db/index";
import { addCashClosing, deleteCashClosing } from "@dao/CashClosingDAO";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";

import { CashClosingCard } from "@components/CashClosingCard";
import { Container, Input, Register, Title } from "./styles";

const cashClosingBody = zod.object({
  total: zod.coerce.number().positive("Informe um valor positivo"),
  type: zod.string().min(1, "Informe um tipo"),
});

export type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function RegisterCashClosing() {
  const [cashClosings, setCashClosings] = useState<CashClosingDTO[]>([]);

  const [sum, setSum] = useState(0);
  const now = dayjs().format("DD/MM/YYYY");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CashClosingFormData>({
    resolver: zodResolver(cashClosingBody),
  });

  async function registerCashClosing(data: CashClosingFormData) {
    try {
      //@ts-ignore
      addCashClosing(data);
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel realizar o cadastro");
      console.error(error);
    }

    reset();
    loadData();
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
             db.write(() =>
            db.delete(db.objects("CashClosingSchema").filtered("id = $0", id))
          )
          },
        },
      ]);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Remover fechamento",
        "Não foi possível remover esse fechamento."
      );
    }
  }
  function loadData() {
    const results = db
      .objects<CashClosingDTO>("CashClosingSchema")
      .filtered("date == $0", now);
    setCashClosings(Array.from(results));
    const calculateSum = results.reduce((acc, item) => acc + item.total, 0);
    setSum(calculateSum);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Heading color="white" size="md">
        Total
      </Heading>
      <Controller
        control={control}
        name="total"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="0.0"
            keyboardType="decimal-pad"
            value={value ?? ""}
            onChangeText={onChange}
          />
        )}
      />
      <Heading color="white" mt={5} size="md">
        Tipo
      </Heading>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Se foi pix, cartão ou despesa"
            onChangeText={onChange}
            value={value ?? ""}
          />
        )}
      />
      <Register
        onPress={handleSubmit(registerCashClosing)}
        disabled={isSubmitting}
      >
        <Heading color="white">Registrar</Heading>
      </Register>
      <SectionList
        sections={[{ title: "Fechamentos do dia", data: cashClosings }]}
        ListEmptyComponent={<Text>Nenhum fechamento cadastrado.</Text>}
        renderItem={({ item }) => (
          <CashClosingCard
            item={item}
            onDelete={() => handleRemoveCashClosing(item.id)}
          />
        )}
      />
      <Heading color="white" mt={10}>
        Total do dia:{" "}
        {sum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </Heading>
    </Container>
  );
}
