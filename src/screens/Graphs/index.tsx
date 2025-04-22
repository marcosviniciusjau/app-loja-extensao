import { Text } from "react-native";
import {
  CartesianGrid,
  Line,
  LineChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "@db/index";

import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
export function Graphs() {
  const [totais, setTotais ] = useState([])
  const [tipos, setTipos ] = useState([])
  function loadData() {
      const results = db.objects<CashClosingDTO>("CashClosingSchema");
      const total = results.map((item) => ({
        total: item.total,
      }));
      setTotais(total)
      const tipo = results.map((item) => ({
        total: item.type,
      }));
      setTipos(tipo)
  }

useEffect(()=>{
  loadData()
})

  return (
    <>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={totais} style={{ fontSize: 12 }}>
          <XAxis dataKey="date" axisLine={false} tickLine={false} dy={16} />

          <YAxis
            stroke="#888"
            width={80}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />

          <CartesianGrid vertical={false} className="stroke-muted" />

          <Line
            type="linear"
            strokeWidth={2}
            dataKey="receipt"
          />
        </LineChart>
      </ResponsiveContainer>
      <Text>Tipos de pagamentos populares:</Text>
      <PieChart style={{ fontSize: 12 }}>
        <Pie
          data={tipo}
          nameKey="product"
          dataKey="amount"
          cx="50%"
          cy="50%"
          outerRadius={86}
          innerRadius={64}
          strokeWidth={8}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = 12 + innerRadius + (outerRadius - innerRadius);
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                className="fill-muted-foreground text-xs"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                ({value})
              </text>
            );
          }}
        >
          {tipos.map((_, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                className="stroke-background hover:opacity-80"
              />
            );
          })}
        </Pie>
      </PieChart>
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
