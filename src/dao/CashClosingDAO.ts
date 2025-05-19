import { getDbConnection } from "@db/index"
import { CashClosing } from "@dtos/CashClosing"
import dayjs from "dayjs"
import { AppError } from "src/error"
const sqlDelete =
  'DELETE FROM CashClosing WHERE id=?';
const sqlInsert =
  'INSERT INTO CashClosing (total, type)' +
  ' VALUES (?,?)';
const sqlUpdate = 'UPDATE CashClosing SET total = ?, type = ? WHERE id = ?';
const startDay = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
const endDay = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
const startWeek = dayjs().startOf("week").format("YYYY-MM-DD HH:mm:ss");
const endWeek = dayjs().endOf("week").format("YYYY-MM-DD HH:mm:ss");
const startMonth = dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss");
const endMonth = dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss");

const sqlSelect = "SELECT * FROM CashClosing WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC";
export async function addCashClosing(cashClosing: CashClosing) {
  try {
    const db = await getDbConnection();
    const inseriu = await db.executeSql(
      sqlInsert,
      [cashClosing.total, cashClosing.type],
    );
  } catch (error) {
    throw new AppError("Erro ao salvar os dados.");
  }
}

export async function updateCashClosing(cashClosing: CashClosing) {
  try {
    const db = await getDbConnection();
    await db.executeSql(
      sqlUpdate,
      [cashClosing.total, cashClosing.type, cashClosing.id],
    );
  } catch (error) {
    throw new AppError("Erro ao atualizar os dados.");
  }
}

export async function fetchCashClosingsToday() {
  const db = await getDbConnection();
  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        sqlSelect,
        [startDay, endDay],
        (_tx, res) => {
          const cashClosings = [];
          for (let i = 0; i < res.rows.length; i++) {
            cashClosings.push(res.rows.item(i));
          }
          resolve(cashClosings);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
}

export async function fetchCashClosingsWeek() {
  const db = await getDbConnection();

  return new Promise((resolve, reject) => {

    db.transaction((txn) => {
      txn.executeSql(
        sqlSelect,
        [startWeek, endWeek],
        (_tx, res) => {
          const cashClosings = [];
          for (let i = 0; i < res.rows.length; i++) {
            cashClosings.push(res.rows.item(i));
          }
          resolve(cashClosings);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
}

export async function fetchCashClosingsMonth() {
  const db = await getDbConnection();
  return new Promise((resolve, reject) => {

    db.transaction((txn) => {
      txn.executeSql(
        sqlSelect,
        [startMonth, endMonth],
        (_tx, res) => {
          const cashClosings = [];
          for (let i = 0; i < res.rows.length; i++) {
            cashClosings.push(res.rows.item(i));
          }
          resolve(cashClosings);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
}
export async function deleteCashClosing(id: number) {
  try {
    const db = await getDbConnection();
    db.transaction(txn => {
      txn.executeSql(
        sqlDelete,
        [id],
      );
    });

  } catch (error) {
    throw new AppError('Ocorreu um erro ao excluir o fechamento')
  }
}