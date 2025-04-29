import { Alert } from "react-native";
import { VStack, SectionList, Text } from "native-base";

import { db } from "@db/index";
import { CashClosing, CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";

import { CashClosingCard } from "@components/CashClosingCard";
import { deleteCashClosing, fetchCashClosing } from "@dao/CashClosingDAO";
import { CashClosingText, Container } from "@components/CashClosingCard/styles";
import { ButtonIcon } from "@components/ButtonIcon";

export function ListWeekCashClosing() {
  const [cashClosing, setCashClosing] = useState<CashClosing[]>([]);
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
    const results = fetchCashClosing();

    setCashClosing(results as unknown as CashClosing[]);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <VStack flex={1}>
      <SectionList
        sections={[{ title: "Fechamentos da semana", data: cashClosing }]}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há registros ainda.
          </Text>
        )}
        renderItem={({ item }) => (
          <CashClosingCard
            onDelete={() => handleRemoveCashClosing(item.id)}
            item={item}
          />
        )}
      />
    </VStack>
  );
}
