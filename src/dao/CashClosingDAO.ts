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
    throw new AppError('Ocorreu um erro ao registrar a despesa. Verifique se digitou todos os campos')
  }
}

export function fetchCashClosing() {
  try {
    return db.objects<CashClosing>("CashClosingSchema")

  } catch (error) {
    throw new AppError('Ocorreu um erro ao listar as despesas')
  }

}

export function deleteCashClosing(id: string) {
  db.write(() =>
    db.delete(db.objects("CashClosingSchema").filtered("id = $0", id))
  )

}