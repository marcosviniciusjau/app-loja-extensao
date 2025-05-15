import { getDbConnection } from "@db/index"
import { CashClosing } from "@dtos/CashClosing"
import dayjs from "dayjs"
import { AppError } from "src/error"
const sqlDelete =
  'DELETE FROM CashClosing WHERE id=?';
const sqlInsert =
  'INSERT INTO CashClosing ( total, type )' +
  ' VALUES (?,?)';

const sqlSelectAll = "SELECT * FROM CashClosing";

const sqlSelectByToday = "SELECT * FROM CashClosing WHERE createdAt LIKE ?";
export async function addCashClosing(cashClosing: CashClosing) {
  try {
    const db = await getDbConnection();

    await db.executeSql(
      `INSERT INTO CashClosing (total, type,createdAt) VALUES (?, ?,?)`,
      [cashClosing.total, cashClosing.type, '2025-05-16 16:34:48']
    );

    console.log("Inserção bem-sucedida.");
  } catch (error) {
    console.error("Erro ao inserir:", error);
    throw new AppError("Erro ao salvar os dados.");
  }
}

export async function fetchCashClosingToday() {
  const today = dayjs().format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {

    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM CashClosing WHERE createdAt LIKE ?',
        [`${today}%`],

        (res) => {
          const cashClosings = [];
          for (let i = 0; i < res.rows.length; i++) {
            cashClosings.push(res.rows.item(i));
          }
          resolve(cashClosings);
        },
        (err) => {
          console.error('Erro ao buscar os fechamentos:', err.message);
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
          resolve(cashClosings);
        },
        (tx, err) => {
          console.error('Erro ao buscar os fechamentos:', err.message);
          reject(err);
        }
      );
    });
  });
}

export async function deleteCashClosing(id: string) {
  try {
    const db = await getDbConnection();
    const numericId = parseInt(id, 10);

    console.log("ID a ser excluído:", numericId);

    db.transaction(txn => {
      txn.executeSql(
        sqlDelete,
        [numericId],
        (_, result) => {
          console.log("Fechamento removido com sucesso:", result);
        },
        (_, error) => {
          console.error("Erro ao remover fechamento:", error);
          return true; // indica que o erro foi tratado
        }
      );
    });

  } catch (error) {
    throw new AppError('Ocorreu um erro ao excluir a despesa')
  }
}