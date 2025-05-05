import React from "react";
import { useEffect, useState } from "react";

import { fetchCashClosing } from "@dao/CashClosingDAO";
import { ButtonIcon } from "../components/ButtonIcon";

import { Container, Main, Sums, Title } from "./styles";

export function ListMonthCashClosing() {
  const [sumRevenues, setSumRevenues] = useState<number>(0);
  const [sumExpenses, setSumExpenses] = useState<number>(0);
  const [sumPurchases, setSumPurchases] = useState<number>(0);
  const mainColor = "#510996";
  function loadData() {
    const results = fetchCashClosing()
    const revenuesTypes = ["Crédito", "Débito", "Pix", "Dinheiro"];
    const revenueResults = results.filter((item) =>
      revenuesTypes.includes(item.type)
    );

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
    const revenuesSum = revenueResults.reduce(
      (acc, item) => acc + item.total,
      0
    );
    setSumRevenues(revenuesSum);
    const expensesSum = expensesResults.reduce(
      (acc, item) => acc + item.total,
      0
    );
    setSumExpenses(expensesSum);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
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
  );
}
