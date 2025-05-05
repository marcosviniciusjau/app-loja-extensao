import React from "react";
import { useEffect, useState } from "react";

import { Alert } from "react-native";
import { Text, VStack } from "native-base"

import { SectionList } from "react-native";
import { deleteCashClosing, fetchCashClosing } from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";
import { CashClosingCard } from "@components/CashClosingCard";
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

    setCashClosing([...results]);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <VStack>
      <SectionList
        sections={[{ key: "Fechamentos da semana", data: cashClosing }]}
        ListEmptyComponent={() => <Text>Não há registros ainda.</Text>}
        renderSectionHeader={({ section }) => <Text>{section.key}</Text>}
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
