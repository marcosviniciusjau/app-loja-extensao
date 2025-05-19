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
  Text,
  View,
  VStack,
} from "native-base";

import zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Options } from "@screens/CashClosing/register/styles";
import {
  fetchCashClosingsMonth,
  fetchCashClosingsWeek,
  updateCashClosing,
} from "@dao/CashClosingDAO";
import dayjs from "dayjs";

type Props = TouchableOpacityProps & {
  onDelete: () => void;
  isWeek: boolean;
  isMonth: boolean;
  onUpdate: () => void;
  item: CashClosing;
};

const cashClosingBody = zod.object({
  total: zod.coerce.number().positive("Informe um valor positivo"),
  type: zod.string().optional(),
});

type CashClosingFormData = zod.infer<typeof cashClosingBody>;

export function CashClosingCard({
  item,
  isMonth,
  isWeek,
  onUpdate,
  onDelete,
  ...rest
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const errorColor = "#FF3131";
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CashClosingFormData>({
    defaultValues: { type: item.type || "" },
    resolver: zodResolver(cashClosingBody),
  });

  const [otherText, setOtherText] = useState("");
  async function handleUpdate(data: CashClosingFormData) {
    try {
      const finalType =
        (data.type === "outro" ? otherText : data.type) || item.type;
      const finalTotal =
        finalType !== item.type ? data.total : item.total + data.total;
      const payload = {
        type: finalType,
        total: finalTotal,
        id: item.id,
      };
      //@ts-ignore
      updateCashClosing(payload);
      reset({ total: 0 });
      reset({ type: "" });
      setOtherText("");
      isMonth && fetchCashClosingsMonth();
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
    <ScrollView>
      {isEditing ? (
        <ContainerUpdate {...rest}>
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
                      marginTop={3}
                      color="white"
                      width={"205%"}
                      backgroundColor={"#000"}
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
        <Container {...rest}>
          <CashClosingText>
            {dayjs(item.created_at).format("DD/MM")}
          </CashClosingText>
          <CashClosingText>
            {new Intl.NumberFormat("pt-BR", {
              style: "decimal",
              minimumFractionDigits: 2,
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
    </ScrollView>
  );
}
