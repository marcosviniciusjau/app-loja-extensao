import React from "react";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { Center, Heading, ScrollView, Text, View } from "native-base";

import { Alert, SectionList } from "react-native";
import {
  deleteCashClosing,
  fetchCashClosingsSelectedMonth,
} from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";
import { CashClosingCard } from "@components/CashClosingCard";
import { Container } from "./styles";
import { ButtonIcon } from "@components/ButtonIcon";
import dayjs from "dayjs";

import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
export function ListMonth() {
  const [cashClosings, setCashClosings] = useState<CashClosing[]>([]);

  const thisMonth = dayjs().month();
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);
  
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
            fetchCashClosings(selectedMonth);
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

  async function fetchCashClosings(monthSelected: number) {
    try {
      const results = (await fetchCashClosingsSelectedMonth(
        monthSelected
      )) as CashClosing[];
      if (Array.isArray(results)) {
        setCashClosings([...(results as CashClosing[])]);
      } else {
        setCashClosings([]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  async function handlePastMonth(monthSelected: number) {
    try {
      const pastMonth = dayjs()
        .month(monthSelected)
        .subtract(1, "month")
        .month();
      setSelectedMonth(pastMonth);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  async function handleNextMonth(monthSelected: number) {
    try {
      const nextMonth = dayjs().month(monthSelected).add(1, "month").month();
      if (nextMonth > thisMonth) {
        Alert.alert(
          "Atenção",
          "Você não pode avançar mais do que o mês atual. Você pode voltar para o mês anterior."
        );
        return;
      }
      setSelectedMonth(nextMonth);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCashClosings(selectedMonth);
    }, [selectedMonth])
  );

  return (
    <ScrollView>
      <Container>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          mb={5}
        >
          <ButtonIcon
            color="white"
            icon="chevron-left"
            onPress={() => {
              handlePastMonth(selectedMonth);
            }}
          />
          <Heading color="white">
            {dayjs()
              .locale("pt-br")
              .month(selectedMonth)
              .year(dayjs().year())
              .format("MMMM [de] YYYY")
              .replace(/^./, (str) => str.toUpperCase())}
          </Heading>
          <ButtonIcon
            color="white"
            icon="chevron-right"
            onPress={() => {
              handleNextMonth(selectedMonth);
            }}
          />
        </View>
        {cashClosings && cashClosings.length > 0 ? (
          <SectionList
            sections={[{ data: cashClosings }]}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={
              cashClosings.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={() => (
              <Text color="gray.100" textAlign="center">
                Não há exercícios registrados ainda. {"\n"}
                Vamos fazer exercícios hoje?
              </Text>
            )}
            renderItem={({ item }) => (
              <CashClosingCard
                isMonth
                isWeek={false}
                item={item}
                selectedMonth={selectedMonth}
                onDelete={() => handleRemoveCashClosing(item.id)}
                onUpdate={() => fetchCashClosings(selectedMonth)}
              />
            )}
          />
        ) : (
          <Heading color="white" textAlign="center" mt={25}>
            Não há fechamentos registrados ainda para esse mês.
          </Heading>
        )}
      </Container>
    </ScrollView>
  );
}
