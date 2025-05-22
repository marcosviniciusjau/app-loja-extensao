import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";

export async function readExcel(uri: string) {
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const workbook = XLSX.read(b64, { type: "base64" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(worksheet);
  return data;
}
