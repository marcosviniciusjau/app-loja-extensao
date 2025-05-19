import React from "react";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { Text } from "native-base";

import { Alert, SectionList } from "react-native";
import { deleteCashClosing, fetchCashClosingsMonth } from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";
import { CashClosingCard } from "@components/CashClosingCard";
import { Container } from "./styles";

export function ListMonth() {
  const [cashClosing, setCashClosing] = useState<CashClosing[]>([]);
  async function handleRemoveCashClosing(id: number) {
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
            fetchAllCashClosings();
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Remover fechamento",
        "Não foi possível remover esse fechamento."
      );
    }
  }

  async function fetchAllCashClosings() {
    try {
      const results = await fetchCashClosingsMonth();
      if (Array.isArray(results)) {
        setCashClosing([...(results as CashClosing[])]);
      } else {
        setCashClosing([]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAllCashClosings();
    }, [])
  );

  return (
    <Container>
      <SectionList
        sections={[{ data: cashClosing }]}
        ListEmptyComponent={() => <Text>Não há registros ainda.</Text>}
        renderItem={({ item }) => (
          <CashClosingCard
            isMonth
            isWeek={false}
            item={item}
            onDelete={() => handleRemoveCashClosing(item.id)}
            onUpdate={fetchAllCashClosings}
          />
        )}
      />
    </Container>
  );
}
