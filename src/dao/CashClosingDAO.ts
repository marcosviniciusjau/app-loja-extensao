import { db } from "@db/index"
import { CashClosing } from "@dtos/CashClosing"
import dayjs from "dayjs"
import { AppError } from "src/error"

export async function addCashClosing(cashClosing: CashClosing) {
  try {
    const date = new Date().toISOString()
    cashClosing.id = date
    cashClosing.date = dayjs().format("DD/MM/YYYY")
    db.write(() => {
      db.create('CashClosingSchema', ({
        id: cashClosing.id,
        total: cashClosing.total,
        type: cashClosing.type,
        date: cashClosing.date,
      }))
    })
  } catch (error) {
    console.error("Ocorreu um erro ao registrar a despesa", error)
    throw new AppError('Ocorreu um erro ao registrar a despesa. Verifique se digitou todos os campos')
  }
}

export function fetchCashClosing() {
  try {
    return db.objects<CashClosing>("CashClosingSchema")
  } catch (error) {
    console.error("Ocorreu um erro ao listar as despesas", error)
    throw new AppError('Ocorreu um erro ao listar as despesas')
  }
}

export function fetchCashClosingToday() {
  try {
    const now = dayjs().format("DD/MM/YYYY")
    return db
      .objects<CashClosing>("CashClosingSchema")
      .filtered("date == $0", now);
  } catch (error) {
    console.error("Ocorreu um erro ao excluir a despesa", error)
    throw new AppError('Ocorreu um erro ao listar as despesas')
  }
}

export function deleteCashClosing(id: string) {
  try {
    db.write(() => {
      const cashClosingToDelete = db.objects("CashClosingSchema").filtered("id = $0", id);
      if (cashClosingToDelete.length > 0) {
        db.delete(cashClosingToDelete);
      }
    });
  } catch (error) {
    console.error("Ocorreu um erro ao excluir a despesa", error)
    throw new AppError('Ocorreu um erro ao excluir a despesa')
  }
}