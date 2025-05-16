import { getDbConnection } from "@db/index"
import { CashClosing } from "@dtos/CashClosing"
import dayjs from "dayjs"
import { AppError } from "src/error"
const sqlDelete =
  'DELETE FROM CashClosing WHERE id=?';
const sqlInsert =
  'INSERT INTO CashClosing (total, type )' +
  ' VALUES (?,?)';
const sqlUpdate = 'UPDATE CashClosing SET total = ?, type = ? WHERE id = ?';

const sqlSelectAll = "SELECT * FROM CashClosing ORDER BY created_at DESC";
const sqlSelectByToday = "SELECT * FROM CashClosing WHERE created_at = ?";

export async function addCashClosing(cashClosing: CashClosing) {
  try {
    const db = await getDbConnection();

    await db.executeSql(
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
    const acordou = await db.executeSql(
      sqlUpdate,
      [cashClosing.total, cashClosing.type, cashClosing.id],
    );
    console.log("acordou", acordou);
  } catch (error) {
    throw new AppError("Erro ao salvar os dados.");
  }
}

export async function fetchCashClosingToday() {
  const db = await getDbConnection();
  const today = dayjs().format("DD/MM/YYYY");
  return new Promise((resolve, reject) => {

    db.transaction((txn) => {
      txn.executeSql(
        sqlSelectByToday,
        [today],
        (tx, res) => {
          const cashClosings = [];
          for (let i = 0; i < res.rows.length; i++) {
            cashClosings.push(res.rows.item(i));
          }
          resolve(cashClosings);
        },
        (tx, err) => {
          reject(err);
        }
      );
    });
  });
}
export async function fetchCashClosings() {
  const db = await getDbConnection();
  return new Promise((resolve, reject) => {

    db.transaction((txn) => {
      txn.executeSql(
        sqlSelectAll,
        [],
        (tx, res) => {
          const cashClosings = [];
          for (let i = 0; i < res.rows.length; i++) {
            cashClosings.push(res.rows.item(i));
          }
          console.log("CashClosings", cashClosings);
          resolve(cashClosings);
        },
        (tx, err) => {
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
    throw new AppError('Ocorreu um erro ao excluir a despesa')
  }
}