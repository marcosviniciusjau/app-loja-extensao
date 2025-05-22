import React from "react";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import {
  fetchAllCashClosings,
  fetchCashClosingsSelectedMonth,
} from "@dao/CashClosingDAO";
import { ButtonIcon } from "../components/ButtonIcon";

import { Container, Main, Sums, Title } from "./styles";
import { Heading, ScrollView, Text, View } from "native-base";
import { Alert } from "react-native";
import { CashClosing } from "@dtos/CashClosing";
import dayjs from "dayjs";
import { exportToExcel } from "@/src/utils/exportToExcel";
import { insertIntoSQLite } from "@/src/utils/convertExcelToSQL";
import { pickExcelFile } from "@/src/utils/pickExcelFile";
import { readExcel } from "@/src/utils/readExcel";

export function Sum() {
  const [sumRevenues, setSumRevenues] = useState<number>(0);
  const [sumExpenses, setSumExpenses] = useState<number>(0);
  const [sumHomeExpenses, setSumHomeExpenses] = useState<number>(0);
  const [sumPurchases, setSumPurchases] = useState<number>(0);
  const [obsTypes, setObsTypes] = useState<string>();
  const thisMonth = dayjs().month();
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);

  async function convertExcelToSQL() {
    try {
      const uri = await pickExcelFile();
      if (!uri) return;

      const data = await readExcel(uri);
      insertIntoSQLite(data);
      Alert.alert(
        "Sucesso",
        "Arquivo importado e dados inseridos com sucesso!"
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível importar o arquivo");
      return;
    }
  }

  async function exportExcel() {
    try {
      const results = (await fetchAllCashClosings()) as CashClosing[];
      exportToExcel(results);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
      return [];
    }
  }
  async function fetchCashClosings(
    monthSelected: number
  ): Promise<CashClosing[]> {
    try {
      const results = (await fetchCashClosingsSelectedMonth(
        monthSelected
      )) as CashClosing[];

      fetchSumCashClosings(results);
      return results;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
      return [];
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
      Alert.alert("Erro", "Não foi possível listar as despesa");
    }
  }
  const mainColor = "#FF3131";

  async function fetchSumCashClosings(results: CashClosing[]) {
    try {
      const revenuesResults = results.filter((item) =>
        item.type.includes("Venda")
      );
      const revenuesTypes = revenuesResults.map((item) => item.type);
      const obs = results.filter((item) => item.total === 0);
      const obsTypes = obs.map((item) => item.type);
      setObsTypes(obsTypes.join(", "));
      const purchasesResults = results.filter((item) =>
        item.type.includes("Compra")
      );
      const purchasesTypes = purchasesResults.map((item) => item.type);
      const expensesResults = results.filter((item) =>
        item.type.includes("Gasto")
      );
      const expensesTypes = expensesResults.map((item) => item.type);

      const expensesHomeResults = results.filter(
        (item) =>
          !revenuesTypes.includes(item.type) &&
          !purchasesTypes.includes(item.type) &&
          !expensesTypes.includes(item.type)
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
      const expensesHomeSum = expensesHomeResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumHomeExpenses(expensesHomeSum);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCashClosings(selectedMonth).then(fetchSumCashClosings);
    }, [selectedMonth])
  );

  return (
    <ScrollView>
      <Main>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          mb={5}
        >
          <ButtonIcon
            icon="save"
            color={mainColor}
            onPress={() => {
              exportExcel();
            }}
          />
          <ButtonIcon
            icon="cloud-upload"
            color={mainColor}
            onPress={() => {
              convertExcelToSQL();
            }}
          />
        </View>
        <Container>
          <ButtonIcon icon="cloud" color="#8e8c8c" />
          <Title color="#bbb7b7">Observações</Title>
          <Sums>{obsTypes || "Não teve observações"}</Sums>
        </Container>
        <Container>
          <ButtonIcon icon="money" color="#00875F" />
          <Title color="#00875F">Receitas</Title>
          <Sums>
            {sumRevenues.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) || 0}
          </Sums>
        </Container>
        <Container>
          <ButtonIcon icon="credit-card" color={mainColor} />
          <Title color={mainColor}>Gastos da Loja</Title>
          <Sums>
            {sumExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) || 0}
          </Sums>
        </Container>
        <Container>
          <ButtonIcon icon="home" color={mainColor} />
          <Title color={mainColor}>Gastos de Casa</Title>
          <Sums>
            {sumHomeExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) || 0}
          </Sums>
        </Container>
        <Container>
          <ButtonIcon icon="shopping-bag" color="#1E90FF" />
          <Title color="#1E90FF">Compras</Title>
          <Sums>
            {sumPurchases.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) || 0}
          </Sums>
        </Container>
      </Main>
    </ScrollView>
  );
}
