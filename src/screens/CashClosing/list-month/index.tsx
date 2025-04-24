import { Text } from "react-native";
import { StyleSheet, View, SectionList } from "react-native";
import { db } from "@db/index";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";

import { Heading } from "native-base";
import dayjs from "dayjs";
interface Types {
  revenues: "Crédito" | "Débito" | "Pix" | "Dinheiro";
}

export function ListMonthCashClosing() {
  const [DATA, setDATA] = useState<CashClosingDTO[]>([]);
  const [sameDay, setSameDay] = useState([]);
  const [differentDays, setDifferentDays] = useState([]);
  const [differentDay, setDifferentDay] = useState();
  const [sumRevenues, setSumRevenues] = useState([]);
  const [sumExpenses, setSumExpenses] = useState([]);
  const [array, setArray] = useState([]);
  const cashClosings = [];
  const now = dayjs().format("DD/MM/YYYY");
  function loadData() {
    const results = db.objects<CashClosingDTO>("CashClosingSchema");

    setDATA(Array.from(results));
    const totais = results.map((item) => ({
      date: item.date,
      total: item.total,
      type: item.type,
    }));
    totais.forEach(createArray);
    function createArray(total) {
      const array = new Array(total);
      cashClosings.push(array);
      setArray(cashClosings);
    }

    cashClosings.forEach(cashClosingSum);
    function cashClosingSum(total) {
      const somas = total.map((item) => item.total);
      const revenuesTypes = ["Crédito", "Débito", "Pix", "Dinheiro"];
      const revenueResults = results.filter((item) =>
        revenuesTypes.includes(item.type)
      );
      const expensesResults = results.filter((item) =>
        !revenuesTypes.includes(item.type)
      );

      const revenues = revenueResults.map((item) => item.total);
      const expenses = expensesResults.map((item) => item.total);

      let somaRevenues = 0;
      for (let i = 0; i < revenues.length; i++) {
        somaRevenues += revenues[i];
      }
      setSumRevenues(somaRevenues);

      let somaExpenses= 0;
      for (let i = 0; i < expenses.length; i++) {
        somaExpenses+= expenses[i];
      }
      setSumExpenses(somaExpenses);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Text>Receitas{sumRevenues}</Text>
      <Text>Gastos{sumExpenses}</Text>

      <SectionList
        sections={[{ title: "Fechamentos", data: differentDays }]}
        keyExtractor={(item, index) => item.date + index}
        ListEmptyComponent={<Text>Não tem nada ainda</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>MUDOU TUDO</Text>
            <Text>{item.total}</Text>
            <Text>{item.type}</Text>
          </View>
        )}
      />

      <Text>Total do dia</Text>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
  },
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
