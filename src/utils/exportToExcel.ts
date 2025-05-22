import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { CashClosing } from "@dtos/CashClosing";

export async function exportToExcel(data: CashClosing[]) {
  try {
    const correctData = data.filter((item) => item.total > 0);
    const obs = data.filter((item) => item.total === 0);
    const obsTypes = obs.map((item) => item.type);
    const objFormatted = obsTypes.join(", ");

    const formattedData = correctData.map((item) => ({
      "Data de Criação": item.created_at,
      "Tipo": item.type,
      "Total do Dia": item.total,
      "Observação": objFormatted,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fechamento de Caixa");

    const excelBase64 = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileUri = FileSystem.cacheDirectory + "fechamento.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, excelBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Erro", "Compartilhamento não suportado neste dispositivo.");
    }
  } catch (error) {
    Alert.alert("Erro", "Falha ao exportar os dados para Excel.");
  }
}
