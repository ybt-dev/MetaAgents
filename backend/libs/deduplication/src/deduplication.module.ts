import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from '@libs/transactions';
import { DeduplicationRecordSchema, DeduplicationRecord } from './schemas';
import { MongodbDeduplicationRecordRepository } from './repositories';
import { DefaultDeduplicationService } from './services';
import DeduplicationModuleTokens from './deduplication.module.tokens';

@Module({
  controllers: [],
  imports: [
    TransactionsModule,
    MongooseModule.forFeature([{ name: DeduplicationRecord.name, schema: DeduplicationRecordSchema }]),
  ],
  providers: [
    {
      provide: DeduplicationModuleTokens.Repositories.DeduplicationRecordRepository,
      useClass: MongodbDeduplicationRecordRepository,
    },
    {
      provide: DeduplicationModuleTokens.Services.DeduplicationService,
      useClass: DefaultDeduplicationService,
    },
  ],
  exports: [DeduplicationModuleTokens.Services.DeduplicationService],
})
export class DeduplicationModule {
  public static Tokens = DeduplicationModuleTokens;
}
