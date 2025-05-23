import React from "react";
import zod, { set } from "zod";
import { useCallback, useState } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, KeyboardAvoidingView, Platform, Button } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heading,
  Text,
  ScrollView,
  SectionList,
  Select,
  VStack,
  Center,
  View,
} from "native-base";
import {
  addCashClosing,
  deleteCashClosing,
  fetchCashClosingsToday,
} from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";

import {
  Container,
  DateContainer,
  Input,
  InputDate,
  Options,
  Register,
} from "./styles";
import { CashClosingCard } from "@components/CashClosingCard";
import dayjs from "dayjs";
import { ButtonIcon } from "@components/ButtonIcon";

export const cashClosingBody = zod.object({
  total: zod.coerce.number().min(0, "Informe um valor positivo"),
  type: zod
    .string()
    .min(1, "Informe um tipo")
    .refine((val) => val === "outro" || val.length > 1, {
      message: "Informe um tipo válido",
    }),
  created_at: zod
    .date()
    .default(() => new Date())
    .optional(),
});

export type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function RegisterCashClosing() {
  const [cashClosings, setCashClosings] = useState<CashClosing[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [otherText, setOtherText] = useState("");

  const [sumRevenues, setSumRevenues] = useState<number>(0);
  const [sumHomeExpenses, setSumHomeExpenses] = useState<number>(0);
  const [sumPurchases, setSumPurchases] = useState<number>(0);
  const [sumBusinessExpenses, setSumBusinessExpenses] = useState<number>(0);
  const [sumOtherExpenses, setSumOtherExpenses] = useState<number>(0);

  const [obsTypes, setObsTypes] = useState<string>();

  const errorColor = "#FF3131";
  
  const [showPicker, setShowPicker] = useState(false);

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
      const newFormattedDate = data.created_at
        ? dayjs(data.created_at).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
      const tipo =
        data.type === "outro" || data.type === "obs" ? otherText : data.type;
      //@ts-ignore
      addCashClosing({ ...data, created_at: newFormattedDate, type: tipo });
      fetchAllCashClosings();
      reset({ total: 0 });
      reset({ type: "" });
      setOtherText("");
    } catch (error) {
      Alert.alert("Erro", "Nao foi possível realizar o cadastro");
    }
  }

  async function handleRemoveCashClosing(id: number) {
    try {
      Alert.alert("Confirmação", "Deseja realmente excluir?", [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            deleteCashClosing(id);
            fetchAllCashClosings();
            reset({ type: "" });
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Remover fechamento",
        "Não foi possível remover esse fechamento."
      );
    }
  }

  async function fetchAllCashClosings() {
    try {
      const results = await fetchCashClosingsToday();
      if (Array.isArray(results)) {
        setCashClosings([...(results as CashClosing[])]);

        fetchSumCashClosings(results);
      } else {
        setCashClosings([]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  async function fetchSumCashClosings(results: CashClosing[]) {
    try {
      const revenuesResults = results.filter((item) =>
        item.type.includes("Venda")
      );
      const revenuesTypes = revenuesResults.map((item) => item.type);

      const obs = results.filter((item) => item.total === 0);
      const obsTypes = obs.map((item) => item.type);
      setObsTypes(obsTypes.join(", "));

      const purchasesResults = results.filter((item) =>
        item.type.includes("Compra")
      );
      const purchasesTypes = purchasesResults.map((item) => item.type);

      const expensesResults = results.filter((item) =>
        item.type.includes("Gasto")
      );
      const expensesTypes = expensesResults.map((item) => item.type);

      const expensesHomeResults = results.filter((item) =>
        item.type.includes("CASA")
      );

      const otherExpenses = results.filter(
        (item) =>
          !revenuesTypes.includes(item.type) &&
          !purchasesTypes.includes(item.type) &&
          !expensesTypes.includes(item.type) &&
          item.total > 0
      );

      const purchasesSum = purchasesResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumPurchases(purchasesSum);

      const revenuesSum = revenuesResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumRevenues(revenuesSum);

      const expensesBusinessResults = expensesResults.filter((item) =>
        item.type.includes("Loja")
      );

      const expensesBusinessSum = expensesBusinessResults.reduce(
        (acc, item) => acc + item.total,
        0
      );

      setSumBusinessExpenses(expensesBusinessSum);
      const otherExpensesSum = otherExpenses.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumOtherExpenses(otherExpensesSum);
      const expensesHomeSum = expensesHomeResults.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setSumHomeExpenses(expensesHomeSum);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as despesas");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAllCashClosings();
    }, [])
  );

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Container>
          <Heading color="white" mt={5} fontSize={"lg"}>
            Data
          </Heading>

          <Controller
            control={control}
            name="created_at"
            render={({ field: { onChange, value } }) =>
              showPicker ? (
                <DateTimePicker
                  value={value ?? new Date()}
                  display="default"
                  mode="date"
                  onChange={(_, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      setSelectedDate(selectedDate);
                      onChange(selectedDate);
                    }
                  }}
                />
              ) : (
                <></>
              )
            }
          />
          <DateContainer>
            <InputDate value={dayjs(selectedDate).format("DD/MM/YYYY")} />
            <ButtonIcon
              color="white"
              icon="calendar"
              onPress={() => setShowPicker(true)}
            />
          </DateContainer>

          <Heading color="white" mt={5} fontSize={"lg"}>
            Total
          </Heading>
          <Controller
            control={control}
            name="total"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0.0"
                keyboardType="decimal-pad"
                value={value ?? ""}
                onChangeText={onChange}
              />
            )}
          />
          {errors.total && <Text color={errorColor}>{"Digite um número"}</Text>}

          <Heading color="white" mt={5} fontSize={"lg"}>
            Tipo
          </Heading>

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <VStack space={5} p={2}>
                <Options
                  selectedValue={value}
                  onValueChange={(val: string) => onChange(val)}
                  borderColor={errorColor}
                  _selectedItem={{
                    bg: "#FF3131",
                    _text: { color: "white" },
                    borderColor: "#fff",
                  }}
                  _item={{
                    bg: "#000",
                    _text: { color: "white" },
                    borderColor: "#FF3131",
                    borderWidth: 1,
                    _pressed: {
                      bg: "#FF3131",
                    },
                  }}
                  _hover={{
                    borderColor: "#FF3131",
                    backgroundColor: "#FF3131",
                  }}
                  _focus={{
                    borderColor: "#FF3131",
                    backgroundColor: "#FF3131",
                  }}
                >
                  <Select.Item
                    label="Compra Pix Loja"
                    value="Compra Pix Loja"
                  />
                  <Select.Item
                    label="Compra Dinheiro Loja"
                    value="Compra Dinheiro Loja"
                  />
                  <Select.Item label="Venda Pix Loja" value="Venda Pix Loja" />
                  <Select.Item
                    label="Venda Cartão Loja"
                    value="Venda Cartão Loja"
                  />
                  <Select.Item
                    label="Venda Dinheiro Loja"
                    value="Venda Dinheiro Loja"
                  />
                  <Select.Item
                    label="Gasto Dinheiro Loja"
                    value="Gasto Dinheiro Loja"
                  />
                  <Select.Item
                    label="Gasto Cartão Loja"
                    value="Gasto Cartão Loja"
                  />
                  <Select.Item label="Gasto Pix Loja" value="Gasto Pix Loja" />
                  <Select.Item
                    label="Gasto Diário Loja"
                    value="Gasto Diário Loja"
                  />
                  <Select.Item
                    label="Gasto Cartão CASA"
                    value="Gasto Cartão CASA"
                  />
                  <Select.Item
                    label="Gasto Dinheiro CASA"
                    value="Gasto Dinheiro CASA"
                  />
                  <Select.Item label="Gasto Pix CASA" value="Gasto Pix CASA" />

                  <Select.Item label="Outro" value="outro" />
                  <Select.Item label="Observações (LOJA)" value="obs" />
                </Options>

                {(value === "outro" || value === "obs") && (
                  <Input
                    placeholder="Digite um tipo"
                    value={otherText}
                    onChangeText={setOtherText}
                  />
                )}
              </VStack>
            )}
          />
          {errors.type && <Text color={errorColor}>{"Selecione um tipo"}</Text>}

          <Register
            onPress={handleSubmit(registerCashClosing)}
            disabled={isSubmitting}
          >
            <Heading color="white">Registrar</Heading>
          </Register>
          <Center>
            <Heading color="white" mb={2} mt={2}>
              Exercício / Ano {dayjs().get("year")}
            </Heading>
          </Center>

          <SectionList
            sections={[{ title: "Fechamentos do dia", data: cashClosings }]}
            ListEmptyComponent={<Text>Nenhum fechamento cadastrado.</Text>}
            renderItem={({ item }) => (
              <CashClosingCard
                isWeek={false}
                isMonth={false}
                onUpdate={fetchAllCashClosings}
                item={item}
                onDelete={() => handleRemoveCashClosing(item.id)}
              />
            )}
          />
          <Heading color="white" mb={5} mt={5}>
            Total de Vendas da Loja do Dia:{" "}
            {sumRevenues.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Heading>
          <Heading color="white" mb={5} mt={5}>
            Total de Gastos da Loja do Dia:{" "}
            {sumBusinessExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Heading>
          <Heading color="white" mb={5} mt={5}>
            Total de Gastos de Casa do Dia:{" "}
            {sumHomeExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Heading>
          <Heading color="white" mb={5} mt={5}>
            Total de outras Despesas do Dia:{" "}
            {sumOtherExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Heading>
          <Heading color="white" mb={5} mt={5}>
            Total de Compras da Loja do Dia:{" "}
            {sumPurchases.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Heading>
        </Container>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
