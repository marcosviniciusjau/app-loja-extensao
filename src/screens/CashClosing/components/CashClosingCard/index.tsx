import { Alert, TouchableOpacityProps } from "react-native";
import { Container, CashClosingText, ContainerUpdate } from "./styles";
import React, { useState } from "react";
import { CashClosing } from "@dtos/CashClosing";
import { ButtonIcon } from "@components/ButtonIcon";
import {
  Button,
  Heading,
  Input,
  ScrollView,
  Select,
  View,
  VStack,
} from "native-base";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Options } from "@screens/CashClosing/register/styles";
import {
  fetchCashClosingsSelectedMonth,
  fetchCashClosingsWeek,
  updateCashClosing,
} from "@dao/CashClosingDAO";
import dayjs from "dayjs";
import {
  cashClosingBody,
  CashClosingFormData,
} from "@screens/CashClosing/register/index";

type Props = TouchableOpacityProps & {
  onDelete: () => void;
  isWeek: boolean;
  selectedMonth?: number;
  isMonth: boolean;
  onUpdate: () => void;
  item: CashClosing;
};

export function CashClosingCard({
  item,
  isMonth,
  isWeek,
  onUpdate,
  selectedMonth,
  onDelete,
  ...rest
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const errorColor = "#FF3131";
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CashClosingFormData>({
    defaultValues: { type: item.type || "" },
    resolver: zodResolver(cashClosingBody),
  });

  function getColorByType(type: string): string {
    const colorsMap = [
      { type: "Venda", color: "#00875F" },
      { type: "Gasto", color: "#FF3131" },
      { type: "Compra", color: "#1E90FF" },
      { type: "CASA", color: "#FF3131" },
    ];

    const match = colorsMap.find((item) =>
      type.toLowerCase().includes(item.type.toLowerCase())
    );
    return match ? match.color : "#8e8c8c";
  }

  const [otherText, setOtherText] = useState("");
  async function handleUpdate(data: CashClosingFormData) {
    try {
      const finalType =
        data.type === "outro" || data.type === "obs" ? otherText : data.type;
      const finalTotal =
        finalType !== item.type ? data.total : item.total + data.total;
      const payload = {
        type: finalType,
        total: finalTotal,
        id: item.id,
      };
      updateCashClosing(payload);
      reset({ total: 0 });
      reset({ type: "" });
      setOtherText("");
      isMonth && fetchCashClosingsSelectedMonth(selectedMonth!);
      isWeek && fetchCashClosingsWeek();
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      Alert.alert(
        "Erro ao atualizar o fechamento de caixa",
        "Não foi possível atualizar o fechamento de caixa."
      );
    }
  }

  return (
    <>
      {isEditing ? (
        <ContainerUpdate
          {...rest}
          style={{ backgroundColor: getColorByType(item.type) }}
        >
          <CashClosingText>
            {dayjs(item.created_at).format("DD/MM")}
          </CashClosingText>
          <View flex={1} flexDirection="row" style={{ gap: 3 }}>
            <Controller
              control={control}
              name="total"
              render={({ field: { onChange, value } }) => (
                <Input
                  width={"40%"}
                  height={"32%"}
                  backgroundColor={"#000"}
                  color={"#fff"}
                  borderColor={errorColor}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  //@ts-ignore
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <VStack>
                  <Options
                    width="250%"
                    backgroundColor={"#000"}
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
                    <Select.Item
                      label="Venda Pix Loja"
                      value="Venda Pix Loja"
                    />
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
                    <Select.Item
                      label="Gasto Pix Loja"
                      value="Gasto Pix Loja"
                    />
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
                    <Select.Item
                      label="Gasto Pix CASA"
                      value="Gasto Pix CASA"
                    />

                    <Select.Item label="Outro" value="outro" />
                    <Select.Item label="Observações (LOJA)" value="obs" />
                  </Options>

                  {(value === "outro" || value === "obs") && (
                    <Input
                      mt={2}
                      width="250%"
                      backgroundColor={"#000"}
                      color={"#fff"}
                      placeholder="Digite um tipo"
                      value={otherText}
                      onChangeText={setOtherText}
                    />
                  )}
                </VStack>
              )}
            />
            <View
              flex={1}
              flexDirection="row"
              style={{ gap: 3 }}
              marginTop={110}
              marginLeft={-20}
            >
              <Button
                onPress={handleSubmit(handleUpdate)}
                disabled={isSubmitting}
                backgroundColor="#00875F"
              >
                <Heading color="white" size={"sm"}>
                  Atualizar
                </Heading>
              </Button>
              <Button
                backgroundColor="#000"
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                <Heading color="white" size={"sm"}>
                  Cancelar
                </Heading>
              </Button>
            </View>
          </View>
        </ContainerUpdate>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Container
            {...rest}
            style={{ backgroundColor: getColorByType(item.type) }}
          >
            <CashClosingText>
              {dayjs(item.created_at).format("DD/MM")}
            </CashClosingText>
            <CashClosingText>
              {item.total > 0
                ? new Intl.NumberFormat("pt-BR", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                  }).format(item.total)
                : ""}
            </CashClosingText>

            <CashClosingText>{item.type}</CashClosingText>
            <ButtonIcon
              icon="pencil"
              color={"#fff"}
              onPress={() => setIsEditing(true)}
            />
            <ButtonIcon icon="trash" color={"#fff"} onPress={onDelete} />
          </Container>
        </ScrollView>
      )}
    </>
  );
}
