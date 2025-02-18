import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AbstractTransactionsManager, TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions/mongodb.transaction';

@Injectable()
export class MongodbTransactionsManager
  extends AbstractTransactionsManager<MongodbTransaction>
  implements TransactionsManager<MongodbTransaction>
{
  constructor(@InjectConnection() private connection: Connection) {
    super();
  }

  protected async createTransaction() {
    const session = await this.connection.startSession();

    return new MongodbTransaction(session);
  }

  protected async processTransaction<Response>(
    transaction: MongodbTransaction,
    callback: (transaction: MongodbTransaction) => Promise<Response>,
  ) {
    return transaction.getSession().withTransaction(async () => {
      // Clear effects if retry happens
      transaction.clearEffects();

      return callback(transaction);
    });
  }

  protected async endTransaction(transaction: MongodbTransaction) {
    await transaction.getSession().endSession();
  }
}
