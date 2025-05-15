// src/db/database.ts
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function getDbConnection() {
  try {
    const db = await SQLite.openDatabase({
      name: 'CashClosing.db',
      location: 'default',
    });

    // Cria a tabela se não existir (só na primeira vez)
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS CashClosing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL,
        type TEXT,
        createdAt TEXT DEFAULT (datetime('now', 'localtime'))
      )
    `);

    return db;
  } catch (error) {
    console.error("Erro ao abrir ou criar banco:", error);
    throw new Error("Não foi possível abrir o banco de dados.");
  }
}
