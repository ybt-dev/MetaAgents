import { AbstractTransaction, Transaction } from '@libs/transactions/transaction';
import { ClientSession } from 'mongoose';

export class MongodbTransaction extends AbstractTransaction implements Transaction {
  constructor(private session: ClientSession) {
    super();
  }

  public getSession() {
    return this.session;
  }
}
