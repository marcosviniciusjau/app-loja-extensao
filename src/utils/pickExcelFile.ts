import * as DocumentPicker from "expo-document-picker";

export async function pickExcelFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ],
  });
  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  }

  return null;
}
