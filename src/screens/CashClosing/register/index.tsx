import React from "react";
import zod from "zod";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heading,
  Text,
  ScrollView,
  SectionList,
  Select,
  VStack,
} from "native-base";
import {
  addCashClosing,
  deleteCashClosing,
  fetchCashClosingToday,
} from "@dao/CashClosingDAO";
import { CashClosing as CashClosingDTO } from "@dtos/CashClosing";

import { CashClosingCard } from "@components/CashClosingCard";
import { Container, Input, Items, Options, Register } from "./styles";
import { border } from "native-base/lib/typescript/theme/styled-system";

const cashClosingBody = zod.object({
  total: zod.coerce.number().positive("Informe um valor positivo"),
  type: zod.string().min(1, "Informe um tipo"),
});

export type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function RegisterCashClosing() {
  const [cashClosings, setCashClosings] = useState<CashClosingDTO[]>([]);
  const [selected, setSelected] = useState("");
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
      //@ts-ignore
      addCashClosing(data);
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel realizar o cadastro");
    }

    reset({ type: "" });
    fetchCashClosings();
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
            deleteCashClosing(id);
            fetchCashClosings();
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
  function fetchCashClosings() {
    const results = fetchCashClosingToday();
    setCashClosings(Array.from(results));
    const calculateSum = results.reduce((acc, item) => acc + item.total, 0);
    setSum(calculateSum);
  }

  useFocusEffect(
    useCallback(() => {
      fetchCashClosings();
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
                  <Select.Item label="Compra Débito" value="Compra Débito" />
                  <Select.Item label="Compra Crédito" value="Compra Crédito" />
                  <Select.Item
                    label="Compra Dinheiro"
                    value="Compra Dinheiro"
                  />
                  <Select.Item label="Venda Pix" value="Venda Pix" />
                  <Select.Item label="Venda Débito" value="Venda Débito" />
                  <Select.Item label="Venda Crédito" value="Venda Crédito" />
                  <Select.Item label="Venda Dinheiro" value="Venda dinheiro" />
                  <Select.Item label="Padaria" value="Padaria" />
                  <Select.Item label="Marcos" value="Marcos" />
                  <Select.Item label="Outro" value="outro" />
                </Options>
                {value === "outro" && (
                  <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Digite o tipo"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                )}
              </VStack>
            )}
          />
          {errors.type && <Text color={errorColor}>{"Digite um tipo"}</Text>}

          <Register
            onPress={handleSubmit(registerCashClosing)}
            disabled={isSubmitting}
          >
            <Heading color="white">Registrar</Heading>
          </Register>
          <SectionList
            sections={[{ title: "Fechamentos do dia", data: cashClosings }]}
            ListEmptyComponent={<Text>Nenhum fechamento cadastrado.</Text>}
            renderItem={({ item }) => (
              <CashClosingCard
                item={item}
                onDelete={() => handleRemoveCashClosing(item.id)}
              />
            )}
          />
          <Heading color="white" mt={10}>
            Total do dia:{" "}
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
