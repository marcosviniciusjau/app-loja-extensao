import { Realm } from '@realm/react';


export class CashClosing extends Realm.Object<CashClosing> {
  _id!: object
  total!: string
  type!: string;
  date!: Date;
  static schema = {
    name: 'CashClosingSchema',
    primaryKey: 'id',

    properties: {
      _id: 'uuid',
      total: 'float',
      type: 'string',
      date: 'date',
    }
  }
}