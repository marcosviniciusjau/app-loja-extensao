import React from "react";
import zod from "zod";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
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
} from "native-base";
import {
  addCashClosing,
  deleteCashClosing,
  fetchCashClosingsToday,
} from "@dao/CashClosingDAO";
import { CashClosing } from "@dtos/CashClosing";

import { Container, Input, Options, Register } from "./styles";
import { CashClosingCard } from "@components/CashClosingCard";
import dayjs from "dayjs";

export const cashClosingBody = zod.object({
  total: zod.coerce.number().positive("Informe um valor positivo"),
  type: zod
    .string()
    .min(1, "Informe um tipo")
    .refine((val) => val === "outro" || val.length > 1, {
      message: "Informe um tipo válido",
    }),
});

export type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function RegisterCashClosing() {
  const [cashClosings, setCashClosings] = useState<CashClosing[]>([]);
  const [otherText, setOtherText] = useState("");
  const errorColor = "#FF3131";
  const [sum, setSum] = useState(0);
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
      const tipo = data.type === "outro" ? otherText : data.type;
      //@ts-ignore
      addCashClosing({ ...data, type: tipo });
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
        const total = results.reduce((acc, item) => {
          return acc + Number(item.total);
        }, 0);
        setSum(total);
      } else {
        setCashClosings([]);
      }
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
                  <Select.Item label="Compra Pix" value="Compra Pix" />
                  <Select.Item
                    label="Compra Dinheiro"
                    value="Compra Dinheiro"
                  />
                  <Select.Item label="Venda Pix" value="Venda Pix" />
                  <Select.Item label="Venda Cartão" value="Venda Cartão" />
                  <Select.Item label="Venda Dinheiro" value="Venda Dinheiro" />
                  <Select.Item label="Gasto Dinheiro" value="Gasto Dinheiro" />
                  <Select.Item label="Gasto Cartão" value="Gasto Cartão" />
                  <Select.Item label="Gasto Pix" value="Gasto Pix" />
                  <Select.Item label="Outro" value="outro" />
                </Options>

                {value === "outro" && (
                  <Input
                    placeholder="Selecione um tipo"
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
            Total do Dia:{" "}
            {sum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Heading>
        </Container>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
