import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function getDbConnection() {
  try {
    const db = await SQLite.openDatabase({
      name: 'CashClosings.db',
      location: 'default',
    });
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS cash_closings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL,
        type TEXT,       
       created_at TEXT DEFAULT (datetime('now', 'localtime'))
 )
    `);

    return db;
  } catch (error) {
    throw new Error("Não foi possível abrir o banco de dados.");
  }
}
