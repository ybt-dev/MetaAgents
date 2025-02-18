import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { SessionNonce } from '@apps/platform/sessions/schemas';

export interface SessionNonceRepository {
  existsByValue(value: string): Promise<boolean>;
  createOne(value: string): Promise<void>;
  deleteOne(value: string): Promise<void>;
}

@Injectable()
export class MongoSessionNonceRepository implements SessionNonceRepository {
  public constructor(
    @InjectModel(SessionNonce.name) private readonly sessionNonceModel: Model<SessionNonce>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async existsByValue(value: string) {
    const result = await this.sessionNonceModel.exists({ value }).exec();

    return !!result;
  }

  public async createOne(value: string) {
    await this.sessionNonceModel.create([{ value }], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });
  }

  public async deleteOne(value: string) {
    await this.sessionNonceModel.deleteOne(
      { value },
      {
        session: this.transactionsManager.getCurrentTransaction()?.getSession(),
      },
    );
  }
}
