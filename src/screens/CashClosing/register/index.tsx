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

export function RegisterCashClosing() {
  const [DATA, setDATA] = useState<CashClosingDTO[]>([]);
  const [array, setArray] = useState([]);
  const [arrayDatas, setArrayDatas] = useState([]);
  const [sum, setSum] = useState(0);
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

    let soma = 0;
    console.log(cashClosings.forEach(cashClosingSum));
    setDATA(Array.from(results));
    function cashClosingSum(total) {
      const somas = total.map((item) => item.total);
      const cars = ["BMW", "Volvo", "Saab", "Ford"];
      let i = 0;
      let text = "";

      for (; somas[i]; ) {
        soma += somas[i];
        setSum(soma);
        i++;
      }
      arraizinho.push(total.map((item) => item.total));
      setArrayDatas(arraizinho);
    }
  }

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
        sections={[{ title: "Fechamentos do dia", data: DATA }]}
        keyExtractor={(item, index) => item.id + index}
        ListEmptyComponent={<Text>Não tem nada ainda</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.total}</Text>
            <Text>{item.type}</Text>
          </View>
        )}
      />{" "}
      <Text>Total do dia {sum}</Text>
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
