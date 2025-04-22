import { Realm } from "@realm/react"

export const db = new Realm({
  path: 'UserDB.realm',
  schema: [
    {
      name: 'UserSchema',
      primaryKey: 'id',
      properties: {
        id: 'string',
        username: 'string',
        password: 'string'
      }
    },
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