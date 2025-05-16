import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function getDbConnection() {
  try {
    const db = await SQLite.openDatabase({
      name: 'CashClosing.db',
      location: 'default',
    });

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS CashClosing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL,
        type TEXT,
        created_at TEXT DEFAULT (strftime('%d/%m/%Y', 'now', 'localtime'))
      )
    `);

    return db;
  } catch (error) {
    throw new Error("Não foi possível abrir o banco de dados.");
  }
}
