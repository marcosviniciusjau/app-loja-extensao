import { db } from "@db/index";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";

import { Heading } from "native-base";
import dayjs from "dayjs";
import { Container, Main } from "./styles";
import { ButtonIcon } from "@components/ButtonIcon";
interface Types {
  revenues: "Crédito" | "Débito" | "Pix" | "Dinheiro";
}

export function ListMonthCashClosing() {
  const [sumRevenues, setSumRevenues] = useState([]);
  const [sumExpenses, setSumExpenses] = useState([]);
  const [array, setArray] = useState([]);
  const cashClosings = [];
  const now = dayjs().format("DD/MM/YYYY");
  function loadData() {
    const results = db.objects<CashClosingDTO>("CashClosingSchema");

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
    function cashClosingSum() {
      const revenuesTypes = ["Crédito", "Débito", "Pix", "Dinheiro"];
      const revenueResults = results.filter((item) =>
        revenuesTypes.includes(item.type)
      );
      const expensesResults = results.filter(
        (item) => !revenuesTypes.includes(item.type)
      );

      const revenues = revenueResults.map((item) => item.total);
      const expenses = expensesResults.map((item) => item.total);

      let sumRevenues = 0;
      for (let i = 0; i < revenues.length; i++) {
        sumRevenues += revenues[i];
      }
      setSumRevenues(sumRevenues);

      let sumExpenses = 0;
      for (let i = 0; i < expenses.length; i++) {
        sumExpenses += expenses[i];
      }
      setSumExpenses(sumExpenses);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Main>
      <Container>
        <ButtonIcon icon="money" />
        <Heading>Receitas</Heading>
        <Heading>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(sumRevenues)}
        </Heading>
      </Container>
      <Container>
        <ButtonIcon icon="credit-card" />
        <Heading>Gastos</Heading>
        <Heading>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(sumExpenses)}
        </Heading>
      </Container>
    </Main>
  );
}
