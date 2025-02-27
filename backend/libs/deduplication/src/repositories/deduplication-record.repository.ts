import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { isDuplicatedMongoError } from '@libs/mongodb-tools/utils';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { DeduplicationRecord } from '@libs/deduplication/schemas';

export interface DeduplicationRecordRepository {
  create(id: string): Promise<boolean>;
}

export class MongodbDeduplicationRecordRepository implements DeduplicationRecordRepository {
  constructor(
    @InjectModel(DeduplicationRecord.name)
    private readonly deduplicationRecordModel: Model<DeduplicationRecord>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async create(id: string) {
    try {
      await this.deduplicationRecordModel.create([{ _id: id }], {
        session: this.transactionsManager.getCurrentTransaction()?.getSession(),
      });

      return true;
    } catch (error: unknown) {
      if (error instanceof Error && isDuplicatedMongoError(error)) {
        return false;
      }

      throw error;
    }
  }
}
