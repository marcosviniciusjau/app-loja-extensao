import { StyleSheet, View } from "react-native";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";

import { db } from "@db/index";
import { CashClosing, CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";

import dayjs from "dayjs";
import { CashClosingCard } from "@components/CashClosingCard";

export function ListWeekCashClosing() {
  const [sameDay, setSameDay] = useState([]);
  const [differentDays, setDifferentDays] = useState([]);
  const [differentDay, setDifferentDay] = useState();
  const now = dayjs().format("DD/MM/YYYY");
  function loadData() {
    const results = db.objects<CashClosingDTO>("CashClosingSchema");

    const dates = results.map((item) => ({
      date: item.date,
      total: item.total,
      type: item.type,
    }));
    console.log("dinovo", dates);
    dates.every(isSameDate);

    function isSameDate(el: CashClosing, index: number, arr: CashClosing[]) {
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
    <VStack flex={1}>
      <SectionList
        sections={[{ title: "Fechamentos do dia", data: sameDay }]}
        keyExtractor={(item, index) => item.date + index}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há registros ainda.
          </Text>
        )}
        renderItem={({ item }) => <CashClosingCard isSameDay item={item} />}
      />

      <SectionList
        sections={[{ title: "Fechamentos", data: differentDays }]}
        keyExtractor={(item, index) => item.date + index}
        ListEmptyComponent={<Text>Não tem nada ainda</Text>}
        renderItem={({ item }) => <CashClosingCard isSameDay={false} item={item} />}
      />

      <Text>Total do dia</Text>
    </VStack>
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
