import { Alert, TouchableOpacityProps } from "react-native";
import { Container, CashClosingText, ContainerUpdate } from "./styles";
import React, { useCallback, useState } from "react";
import { CashClosing } from "@dtos/CashClosing";
import { ButtonIcon } from "@components/ButtonIcon";
import {
  Button,
  Heading,
  Input,
  Select,
  Text,
  View,
  VStack,
} from "native-base";

import zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Options } from "@screens/CashClosing/register/styles";
import { fetchCashClosings, updateCashClosing } from "@dao/CashClosingDAO";
import { useFocusEffect } from "@react-navigation/native";

type Props = TouchableOpacityProps & {
  onDelete: () => void;
  onUpdate: () => void;
  item: CashClosing;
};

const cashClosingBody = zod.object({
  total: zod.coerce.number().positive("Informe um valor positivo"),
  type: zod
    .string()
    .min(1, "Informe um tipo")
    .refine((val) => val === "outro" || val.length > 1, {
      message: "Informe um tipo válido",
    }),
});

type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function CashClosingCard({ item, onUpdate, onDelete, ...rest }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const errorColor = "#FF3131";
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CashClosingFormData>({
    resolver: zodResolver(cashClosingBody),
  });

  const [otherText, setOtherText] = useState("");
  async function handleUpdate(data: CashClosingFormData) {
    try {
      const payload = {
        ...data,
        id: item.id,
      };
      //@ts-ignore
      updateCashClosing(payload);
      fetchCashClosings();
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.log("Erro ao atualizar:", error);
      Alert.alert(
        "Erro ao atualizar o fechamento de caixa",
        "Não foi possível atualizar o fechamento de caixa."
      );
    }
  }

  return (
    <>
      {isEditing ? (
        <ContainerUpdate {...rest}>
          <CashClosingText>{item.created_at}</CashClosingText>
          <View flex={1} flexDirection="row" style={{ gap: 3 }}>
            <Controller
              control={control}
              name="total"
              render={({ field: { onChange, value } }) => (
                <Input
                  width={"40%"}
                  height={"40%"}
                  backgroundColor={"#000"}
                  color={"#fff"}
                  borderColor={errorColor}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  value={value ?? ""}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.total && (
              <CashClosingText color={errorColor}>
                {"Informe um valor positivo"}
              </CashClosingText>
            )}
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
                    <Select.Item label="Compra Pix" value="Compra Pix" />
                    <Select.Item
                      label="Compra Dinheiro"
                      value="Compra Dinheiro"
                    />
                    <Select.Item label="Venda Pix" value="Venda Pix" />
                    <Select.Item label="Venda Cartão" value="Venda Cartão" />
                    <Select.Item
                      label="Venda Dinheiro"
                      value="Venda Dinheiro"
                    />
                    <Select.Item
                      label="Gasto Dinheiro"
                      value="Gasto Dinheiro"
                    />
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
            {errors.type && (
              <Text color={errorColor}>{"Selecione um tipo"}</Text>
            )}
            <View
              flex={1}
              flexDirection="row"
              style={{ gap: 3 }}
              marginTop={70}
              marginLeft={-20}
            >
              <Button
                onPress={handleSubmit(handleUpdate)}
                disabled={isSubmitting}
                backgroundColor="#00875F"
              >
                <Heading color="white" size={"sm"}>
                  Registrar
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
        <Container {...rest}>
          <CashClosingText>{item.created_at}</CashClosingText>
          <CashClosingText>
            {" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.total)}
          </CashClosingText>

          <CashClosingText>{item.type}</CashClosingText>
          <ButtonIcon
            icon="pencil"
            color={"#fff"}
            onPress={() => setIsEditing(true)}
          />
          <ButtonIcon icon="trash" color={"#fff"} onPress={onDelete} />
        </Container>
      )}
    </>
  );
}
