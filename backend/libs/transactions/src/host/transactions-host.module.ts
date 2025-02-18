import { Global, Module, ModuleMetadata } from '@nestjs/common';

export interface TransactionsHostModuleForRootOptions extends Pick<ModuleMetadata, 'imports'> {
  useExistingTransactionsManager: unknown;
}

const TRANSACTIONS_MANAGER_TOKEN = Symbol('LOCK_SERVICE_TOKEN');

@Global()
@Module({})
export class TransactionsHostModule {
  public static TRANSACTIONS_MANAGER_TOKEN = TRANSACTIONS_MANAGER_TOKEN;

  public static forRoot(options: TransactionsHostModuleForRootOptions) {
    return {
      module: TransactionsHostModule,
      imports: options.imports,
      providers: [
        {
          provide: TRANSACTIONS_MANAGER_TOKEN,
          useExisting: options.useExistingTransactionsManager,
        },
      ],
      exports: [TRANSACTIONS_MANAGER_TOKEN],
    };
  }
}
