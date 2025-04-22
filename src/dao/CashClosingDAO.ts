import { db } from "@db/index";
import { CashClosing } from "@dtos/CashClosing";
import { AppError } from "src/error";
export async function addCashClosing(cashClosing: CashClosing) {
  db.beginTransaction();
  try {
    const certo = db.write(()=>{
      db.create('CashClosing',({
        id: cashClosing.id,
        total: cashClosing.total,
        date: cashClosing.date,
      }));
    });
    console.log("tá me tirando?", certo)
  } catch (error) {
    console.log("erro", error)
    throw new AppError('Ocorreu um erro ao registrar a despesa. Verifique se digitou todos os campos')
  }
}