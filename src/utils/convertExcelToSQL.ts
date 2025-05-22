import SQLite from 'react-native-sqlite-storage';

export async function insertIntoSQLite(rows: any[]) {
  const db = await SQLite.openDatabase({
    name: 'CashClosings.db',
    location: 'default',
  });
  db.transaction((tx) => {
    rows.forEach((row) => {
      const { "Data de Criação": created_at, "Total do Dia": total, Tipo: type, Id: id } = row;
      tx.executeSql(
        "INSERT INTO cash_closings (created_at, total, type, id) VALUES (?, ?, ?,?);",
        [created_at, total, type]
      );
    });
  });
}
