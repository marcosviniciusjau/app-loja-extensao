import { Text } from "react-native";
import { StyleSheet, View, SectionList } from "react-native";
import { db } from "@db/index";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";

import { Heading } from "native-base";
import dayjs from "dayjs";

export function ListWeekCashClosing() {
  const [DATA, setDATA] = useState<CashClosingDTO[]>([]);
  const [sameDay, setSameDay] = useState([]);
  const [differentDays, setDifferentDays] = useState([]);
  const [differentDay, setDifferentDay] = useState();
  const [sums, setSums] = useState([]);
  const now = dayjs().format("DD/MM/YYYY");
  function loadData() {
    const results = db.objects<CashClosingDTO>("CashClosingSchema");

    const dates = results.map((item) => ({
      date: item.date,
      total: item.total,
      type: item.type,
    }));
    console.log("dinovo", dates)
    dates.every(isSameDate);

    function isSameDate(el, index, arr) {
      if (index === 0) {
        return true;
      } else {
        setDifferentDay(arr[index].date);
        return el.date === arr[index - 1].date;
      }
    }
    setDifferentDays(dates.filter((item) => item.date === differentDay));
    setSameDay(dates.filter((item) => item.date !== differentDay));
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <SectionList
        sections={[{ title: "Fechamentos do dia", data: sameDay }]}
        keyExtractor={(item, index) => item.date + index}
        ListEmptyComponent={<Text>Não tem nada ainda</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>È DO DIA</Text>
            <Text>{item.total}</Text>
            <Text>{item.type}</Text>
          </View>
        )}
      />

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
