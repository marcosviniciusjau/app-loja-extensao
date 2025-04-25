import { Alert, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, SectionList } from "react-native";
import { db } from "@db/index";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";
import { useEffect, useState } from "react";
import React from "react";
import zod from "zod";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Input, Register } from "./styles";
import { Heading } from "native-base";
import { CashClosingCard } from "@components/CashClosingCard";

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
  const [sum, setSum] = useState(0);
  const cashClosings = [];
  const now = dayjs().format("DD/MM/YYYY");
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
    reset();
  }
  async function handleRemoveCashClosing(id: string) {
    try {
      Alert.alert("Confirmação", "Deseja realmente excluir?", [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            db.write(() =>
              db.delete(db.objects("CashClosingSchema").filtered("id = $0", id))
            );

            loadData();
          },
        },
      ]);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Remover fechamento",
        "Não foi possível remover esse fechamento."
      );
    }
  }
  function loadData() {
    const results = db
      .objects<CashClosingDTO>("CashClosingSchema")
      .filtered("date == $0", now);

    setDATA(Array.from(results));
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

    let soma = 0;
    cashClosings.forEach(cashClosingSum);
    function cashClosingSum(total) {
      const somas = total.map((item) => item.total);
      let i = 0;

      for (; somas[i]; ) {
        soma += somas[i];
        setSum(soma);
        i++;
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);
  return (
    <Container>
      <Text>Total</Text>
      <Controller
        control={control}
        name="total"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="0.0"
            onBlur={onBlur}
            keyboardType="decimal-pad"
            onChangeText={onChange}
            value={value?.toString() ?? ""}
          />
        )}
      />
      {errors.total && <Text style={styles.error}>{errors.total.message}</Text>}
      <Text>Tipo</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Se foi pix, cartão ou despesa"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ""}
            style={styles.input}
          />
        )}
      />
      {errors.type && <Text style={styles.error}>{errors.type.message}</Text>}
      <Register
        onPress={handleSubmit(registerCashClosing)}
        title="Registrar"
        disabled={isSubmitting}
      />
      <SectionList
        sections={[{ title: "Fechamentos do dia", data: DATA }]}
        keyExtractor={(item, index) => item.id + index}
        ListEmptyComponent={<Text>Não tem nada ainda</Text>}
        renderItem={({ item }) => (
          <CashClosingCard
            item={item}
            onDelete={()=>handleRemoveCashClosing(item.id)}
          />
        )}
      />{" "}
      <Heading>
        Total do dia:{" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(sum)}
      </Heading>
    </Container>
  );
}

const styles = StyleSheet.create({
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
