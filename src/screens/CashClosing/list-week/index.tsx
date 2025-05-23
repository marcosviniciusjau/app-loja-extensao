import React from "react";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, Text } from "native-base";

import { Alert, SectionList } from "react-native";
import { deleteCashClosing, fetchCashClosingsWeek } from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";
import { CashClosingCard } from "@components/CashClosingCard";
import { Container } from "./styles";

export function ListWeek() {
  const [cashClosings, setCashClosings] = useState<CashClosing[]>([]);

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
      const results = await fetchCashClosingsWeek();
      if (Array.isArray(results)) {
        setCashClosings([...(results as CashClosing[])]);
      } else {
        setCashClosings([]);
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
    <ScrollView>
      <Container>
        <SectionList
          sections={[{ data: cashClosings }]}
          ListEmptyComponent={() => <Text>Não há registros ainda.</Text>}
          renderItem={({ item }) => (
            <CashClosingCard
              isWeek
              isMonth={false}
              item={item}
              onDelete={() => handleRemoveCashClosing(item.id)}
              onUpdate={fetchAllCashClosings}
            />
          )}
        />
      </Container>
    </ScrollView>
  );
}
