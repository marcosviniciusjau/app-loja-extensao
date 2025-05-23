import { getDbConnection } from "@db/index"
import { CashClosingFormData } from "@screens/CashClosing/register";
import dayjs from "dayjs"
import { AppError } from "src/error"

const sqlDelete =
  'DELETE FROM cash_closings WHERE id=?';

const sqlInsert =
  'INSERT INTO cash_closings (created_at, total, type)' +
  ' VALUES (?,?,?)';

const sqlUpdate = 'UPDATE cash_closings SET created_at = ?, total = ?, type = ? WHERE id = ?';

const today = dayjs().format("YYYY-MM-DD");
const startWeek = dayjs().startOf("week").format("YYYY-MM-DD");
const endWeek = dayjs().endOf("week").format("YYYY-MM-DD");

const sqlSelectToday = "SELECT * FROM cash_closings WHERE created_at= ?";

const sqlSelect = "SELECT * FROM cash_closings WHERE created_at BETWEEN ? AND ? ORDER BY created_at ASC";

const sqlSelectAll = "SELECT * FROM cash_closings ORDER BY created_at ASC";

type CashClosingSelected = {
  id: number;
  total: number;
  created_at: string;
  type: string;
}

export async function addCashClosing(cashClosing: CashClosingFormData) {
  try {
    const db = await getDbConnection();
    await db.executeSql(
      sqlInsert,
      [cashClosing.created_at, cashClosing.total, cashClosing.type],
    );
  } catch (error) {
    throw new AppError("Erro ao salvar os dados.");
  }
}

export async function updateCashClosing(cashClosing: CashClosingSelected) {
  try {
    const db = await getDbConnection();

    await db.executeSql(
      sqlUpdate,
      [cashClosing.created_at, cashClosing.total, cashClosing.type, cashClosing.id],
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
        sqlSelectToday,
        [today],
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

export async function fetchAllCashClosings() {
  const db = await getDbConnection();

  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        sqlSelectAll,
        [],
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

export async function fetchCashClosingsSelectedMonth(selectedMonth: number) {
  const startSelectedMonth = dayjs().month(selectedMonth).startOf("month").format("YYYY-MM-DD HH:mm:ss");
  const endSelectedMonth = dayjs().month(selectedMonth).endOf("month").format("YYYY-MM-DD HH:mm:ss");
  const db = await getDbConnection();

  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        sqlSelect,
        [startSelectedMonth, endSelectedMonth],
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