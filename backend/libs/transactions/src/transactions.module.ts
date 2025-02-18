import { DynamicModule, Module } from '@nestjs/common';
import { TransactionsHostModule, TransactionsHostModuleForRootOptions } from './host';
import TransactionsModuleTokens from './transactions.module.tokens';

export type TransactionsModuleForRootOptions = TransactionsHostModuleForRootOptions;

@Module({
  controllers: [],
  providers: [
    {
      provide: TransactionsModuleTokens.Managers.TransactionsManager,
      useExisting: TransactionsHostModule.TRANSACTIONS_MANAGER_TOKEN,
    },
  ],
  exports: [TransactionsModuleTokens.Managers.TransactionsManager],
})
export class TransactionsModule {
  public static forRoot(options: TransactionsModuleForRootOptions): DynamicModule {
    return {
      module: TransactionsModule,
      imports: [TransactionsHostModule.forRoot(options)],
    };
  }
}
