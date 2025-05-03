import React from "react"
import { useEffect, useState } from "react"

import { fetchCashClosing } from "@dao/CashClosingDAO"
import { ButtonIcon } from "@components/ButtonIcon"

import { Container, Main, Sums, Title } from "./styles"

export function ListMonthCashClosing() {
  const [sumRevenues, setSumRevenues] = useState<number>()
  const [sumExpenses, setSumExpenses] = useState<number>()
  const [sumPurchases, setSumPurchases] = useState<number>()
  function loadData() {
    const results = fetchCashClosing()

    const revenuesTypes = ["Crédito", "Débito", "Pix", "Dinheiro"]
    const revenueResults = results.filter((item) =>
      revenuesTypes.includes(item.type)
    )

    const purchasesResults = results.filter((item) =>
      item.type.includes("Compra")
    )
    const purchasesTypes = purchasesResults.map((item) => item.type)

    const expensesResults = results.filter(
      (item) =>
        !revenuesTypes.includes(item.type) &&
        !purchasesTypes.includes(item.type)
    )

    const purchasesSum = purchasesResults.reduce(
      (acc, item) => acc + item.total,
      0
    )
    setSumPurchases(purchasesSum)
    const revenuesSum = revenueResults.reduce(
      (acc, item) => acc + item.total,
      0
    )
    setSumRevenues(revenuesSum)
    const expensesSum = expensesResults.reduce(
      (acc, item) => acc + item.total,
      0
    )
    setSumExpenses(expensesSum)
  }
  
  useEffect(() => {
    loadData()
  }, [])

  return (
    <Main>
      <Container>
        <ButtonIcon icon="money" color={"#510996"} />
        <Title>Receitas</Title>
        <Sums>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(sumRevenues!)}
        </Sums>
      </Container>
      <Container>
        <ButtonIcon icon="credit-card" color={"#510996"} />
        <Title>Gastos</Title>
        <Sums>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(sumExpenses!)}
        </Sums>
      </Container>
      <Container>
        <ButtonIcon icon="shopping-bag" color={"#510996"} />
        <Title>Compras</Title>
        <Sums>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(sumPurchases!)}
        </Sums>
      </Container>
    </Main>
  )
}
