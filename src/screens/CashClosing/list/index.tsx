import { Text } from "react-native";
import { StyleSheet, View, SectionList } from "react-native";
import { db } from "@db/index";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";

import { Heading } from "native-base";

export function ListCashClosing() {
  const [DATA, setDATA] = useState<CashClosingDTO[]>([]);
  const [array, setArray] = useState([]);
  const [arrayDatas, setArrayDatas] = useState([]);
  const cashClosings = [];
  const arraizinho = [];
  const sameDayArray = [];

  function loadData() {
    const results = db.objects<CashClosingDTO>("CashClosingSchema");
    const totais = results.map((item) => ({
      date: item.date,
      total: item.total,
      type: item.type,
    }));

    const datas = results.map((item) => ({
      date: item.date,
      total: item.total,
    }));

    totais.forEach(createArray);
    function createArray(age) {
      const array = new Array(age);
      cashClosings.push(array);
      setArray(cashClosings);
    }

    let sum = 0;
    cashClosings.forEach(cashClosingSum);
    setDATA(Array.from(results));
    // let sum = totais.reduce(cashClosingSum);
    function cashClosingSum(total) {
      arraizinho.push(total.map((item) => item.date));

      setArrayDatas(arraizinho);
    }
  }

  const differentDayArray = [];
  function isSameDate(el, index, arr) {
    if (index === 0) {
      const diff = arr[index];
      return true;
    } else {
      const sameDay = arr[index - 1];
      sameDayArray.push(sameDay);
      return el.date === arr[index - 1].date;
    }
  }
  const sameDays = DATA.every(isSameDate);
  const diffDays = DATA.filter((el, index, arr) => {
    if (index === 0) return false;
    return el.date !== arr[index - 1].date;
  });
  console.log("tudo certo", sameDayArray, diffDays);
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <SectionList
        sections={[{ title: "Fechamentos do dia", data: sameDayArray }]}
        keyExtractor={(item, index) => item.id + index}
        ListEmptyComponent={<Text>Não tem nada ainda</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>È DO DIA</Text>
            <Text>{item.total}</Text>
            <Text>{item.type}</Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mt={10}
            mb={3}
          >
            {item.date}
          </Heading>
        )}
      />

      <SectionList
        sections={[{ title: "Fechamentos", data: diffDays }]}
        keyExtractor={(item, index) => item.id + index}
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
