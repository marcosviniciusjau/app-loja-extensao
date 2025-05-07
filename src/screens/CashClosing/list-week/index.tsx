import React from "react";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, Text, VStack } from "native-base";

import { Alert, SectionList } from "react-native";
import { deleteCashClosing, fetchCashClosing } from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";
import { CashClosingCard } from "@components/CashClosingCard";
import { Loading } from "@components/Loading";
import { Container } from "./styles";
export function ListWeekCashClosing() {
  const [cashClosing, setCashClosing] = useState<CashClosing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            fetchCashClosings();
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

  function fetchCashClosings() {
    try {
      setIsLoading(true);
      const results = fetchCashClosing();
      setCashClosing([...results]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCashClosings();
    }, [])
  );

  return (
      <Container>
        {isLoading ? (
          <Loading/>
        ) : (
          <SectionList
            sections={[{ data: cashClosing }]}
            ListEmptyComponent={() => <Text>Não há registros ainda.</Text>}
            renderItem={({ item }) => <CashClosingCard item={item} onDelete={() => handleRemoveCashClosing(item.id)}/>}
          />
        )}
      </Container>
  );
}
