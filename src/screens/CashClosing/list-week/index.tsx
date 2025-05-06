import React from "react"
import { useEffect, useState } from "react"

import { Text, VStack } from "native-base"

import { SectionList } from "react-native"
import { fetchCashClosing } from "@dao/CashClosingDAO"
import { CashClosing } from "@dtos/CashClosing"
import { CashClosingCard } from "@components/CashClosingCard"
export function ListWeekCashClosing() {
  const [cashClosing, setCashClosing] = useState<CashClosing[]>([])

  function loadData() {
    const results = fetchCashClosing()
    setCashClosing([...results])
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <VStack>
      <SectionList
        sections={[{ key: "Fechamentos da semana", data: cashClosing }]}
        ListEmptyComponent={() => <Text>Não há registros ainda.</Text>}
        renderSectionHeader={({ section }) => <Text>{section.key}</Text>}
        renderItem={({ item }) => (
          <CashClosingCard
            item={item}
          />
        )}
      />
    </VStack>
  );
}
