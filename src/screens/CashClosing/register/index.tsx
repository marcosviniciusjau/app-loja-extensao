import React from "react";
import zod from "zod";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, Text, StyleSheet, SectionList } from "react-native";
import { ScrollView } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { db } from "@db/index";
import { addCashClosing, deleteCashClosing } from "@dao/CashClosingDAO";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";

import { CashClosingCard } from "@components/CashClosingCard";
import { CashClosingText } from "@components/CashClosingCard/styles";
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
            deleteCashClosing(id);
            loadData();
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
    <ScrollView>
      <Container>
        <CashClosingText>Total</CashClosingText>
        <Controller
          control={control}
          name="total"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="0.0"
              keyboardType="decimal-pad"
              value={value.toString() ?? ""}
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
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Se foi pix, cartão ou despesa"
              onChangeText={onChange}
              value={value ?? ""}
            />
          )}
        />
        {errors.type && <Text style={styles.error}>{errors.type.message}</Text>}
        <Register
          onPress={handleSubmit(registerCashClosing)}
          disabled={isSubmitting}
        >
          <CashClosingText>Registrar</CashClosingText>
        </Register>
        <SectionList
          sections={[{ title: "Fechamentos do dia", data: cashClosings }]}
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
  );
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
});
