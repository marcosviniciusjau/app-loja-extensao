import { Realm } from "@realm/react"

export const db = new Realm({
  path: 'CashClosingDB.realm',
  schema: [
    {
      name: 'CashClosingSchema',
      primaryKey: 'id',
      properties: {
        id: 'string',
        date: 'string',
        total: 'float',
        type: 'string'
      }
    }
  ]
})