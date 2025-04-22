import { Button, TextInput, Text } from "react-native";
import { addCashClosing } from "@dao/CashClosingDAO";
import { nanoid } from "nanoid";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View, SectionList } from "react-native";
import { db } from "@db/index";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";
import zod from "zod";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema de validação
const cashClosingBody = zod.object({
  id: zod.string().uuid().optional(),
  total: zod.coerce.number().positive("Informe um valor positivo"),

  date: zod.string().optional(),
  type: zod.string().min(1, "Informe um tipo"),
});

type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function ListCashClosing() {
  const [DATA, setDATA] = useState<CashClosingDTO[]>([]);
  const [array, setArray] = useState([]);
  const [arrayDatas, setArrayDatas] = useState([]);
  const cashClosings = [];
  const arraizinho = [];
  const sameDayArray = [];
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CashClosingFormData>({
    resolver: zodResolver(cashClosingBody),
  });

  async function registerCashClosing(data: CashClosingFormData) {
    try {
      const date = new Date().toISOString();
      data.id = date;
      data.date = dayjs().format("DD/MM/YYYY");

      const bd = db.write(() => {
        db.create("CashClosingSchema", {
          id: data.id,
          type: data.type,
          total: data.total,
          date: data.date,
        });
      });
    } catch (error) {
      console.error(error);
    }

    loadData();
    reset(); // limpa o formulário após cadastro
  }

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

  const survey = [
    { name: "Steve", answer: "Yes" },
    { name: "Jessica", answer: "Yes" },
    { name: "Peter", answer: "Yes" },
    { name: "Elaine", answer: "Yes" },
  ];
  const differentDayArray = [];
  // Function to Run for every Element
  function isSameDate(el, index, arr) {
    // Return true for the first element

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
    if (index === 0) return false; // ignora o primeiro
    return el.date !== arr[index - 1].date;
  });
  console.log("tudo certo", sameDayArray, diffDays);
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Text>Total</Text>
      <Controller
        control={control}
        name="total"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="0.0"
            onBlur={onBlur}
            keyboardType="decimal-pad"
            onChangeText={onChange}
            value={value?.toString() ?? ""}
            style={styles.input}
          />
        )}
      />
      {errors.total && <Text style={styles.error}>{errors.total.message}</Text>}
      <Text>Tipo</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Se foi pix, cartão ou despesa"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ""}
            style={styles.input}
          />
        )}
      />
      {errors.type && <Text style={styles.error}>{errors.type.message}</Text>}
      <Button
        onPress={handleSubmit(registerCashClosing)}
        title="Registrar"
        disabled={isSubmitting}
      />
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
      />{" "}
      
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
