import React from "react";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { fetchCashClosing } from "@dao/CashClosingDAO";
import { ButtonIcon } from "../components/ButtonIcon";

import { Container, Main, Sums, Title } from "./styles";
import { ScrollView, Text } from "native-base";
import { Loading } from "@components/Loading";
import { Alert } from "react-native";

export function ListMonthCashClosing() {
  const [sumRevenues, setSumRevenues] = useState<number>(0);
  const [sumExpenses, setSumExpenses] = useState<number>(0);
  const [sumPurchases, setSumPurchases] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const mainColor = "#FF3131";
  function fetchSumCashClosings() {
    try {
      setIsLoading(true);
      const results = fetchCashClosing();
      const revenuesResults = results.filter((item) =>
        item.type.includes("Venda")
      );
      const revenuesTypes = revenuesResults.map((item) => item.type);

      const purchasesResults = results.filter((item) =>
        item.type.includes("Compra")
      );
      const purchasesTypes = purchasesResults.map((item) => item.type);

      const expensesResults = results.filter(
        (item) =>
          !revenuesTypes.includes(item.type) &&
          !purchasesTypes.includes(item.type)
      );

      const purchasesSum = purchasesResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumPurchases(purchasesSum);
      const revenuesSum = revenuesResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumRevenues(revenuesSum);
      const expensesSum = expensesResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumExpenses(expensesSum);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchSumCashClosings();
    }, [])
  );

  return (
    <ScrollView>
      {isLoading ? (
          <Loading/>
      ) : (
        <Main>
          <Container>
            <ButtonIcon icon="money" color={mainColor} />
            <Title>Receitas</Title>
            <Sums>
              {sumRevenues.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }) || 0}
            </Sums>
          </Container>
          <Container>
            <ButtonIcon icon="credit-card" color={mainColor} />
            <Title>Gastos</Title>
            <Sums>
              {sumExpenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }) || 0}
            </Sums>
          </Container>
          <Container>
            <ButtonIcon icon="shopping-bag" color={mainColor} />
            <Title>Compras</Title>
            <Sums>
              {sumPurchases.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }) || 0}
            </Sums>
          </Container>
        </Main>
      )}
    </ScrollView>
  );
}
