import { Module } from '@nestjs/common';
import { MongodbTransactionsManager } from './managers';

@Module({
  providers: [
    {
      provide: MongodbTransactionsManager,
      useClass: MongodbTransactionsManager,
    },
  ],
  exports: [MongodbTransactionsManager],
})
export class MongodbTransactionsModule {}
