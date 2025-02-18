import { Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Transaction } from '@libs/transactions/transaction';

export interface TransactionOptions {
  forceNewTransaction?: boolean;
}

export interface TransactionsManager<TransactionType extends Transaction = Transaction> {
  useTransaction<Response>(
    callback: (transaction: TransactionType) => Promise<Response>,
    options?: TransactionOptions,
  ): Promise<Response>;
  getTransactionById(transactionId: string): TransactionType | undefined;
  getCurrentTransaction(): TransactionType | undefined;
  useSuccessfulCommitEffect(effect: () => Promise<void>): Promise<void>;
}

export abstract class AbstractTransactionsManager<TransactionType extends Transaction> {
  private transactionsAsyncLocalStorage: AsyncLocalStorage<TransactionType> = new AsyncLocalStorage();
  private transactions: Record<string, TransactionType> = {};

  public async useTransaction<Response>(
    callback: (transaction: TransactionType) => Promise<Response>,
    options?: TransactionOptions,
  ) {
    const existingTransaction = !options?.forceNewTransaction ? this.getCurrentTransaction() : undefined;

    if (existingTransaction) {
      return callback(existingTransaction);
    }

    const transaction = await this.createTransaction();

    this.transactions[transaction.getId()] = transaction;

    return this.transactionsAsyncLocalStorage.run(transaction, async () => {
      try {
        const response = await this.processTransaction<Response>(transaction, callback);

        // Do not await effects, they should happen independently of transaction
        this.runSuccessfulCommitEffects(transaction).catch((err) => {
          Logger.error(`Transaction effect error for ${transaction.getId()}: ${err.message}`);
        });

        return response;
      } finally {
        delete this.transactions[transaction.getId()];

        await this.endTransaction(transaction);
      }
    });
  }

  public getTransactionById(transactionId: string) {
    return this.transactions[transactionId] ?? undefined;
  }

  public getCurrentTransaction(): TransactionType | null {
    return this.transactionsAsyncLocalStorage.getStore();
  }

  public async useSuccessfulCommitEffect(effect: () => Promise<void>): Promise<void> {
    const transaction = this.getCurrentTransaction();

    if (!transaction) {
      effect().catch((error) => {
        Logger.error(`Transaction effect error: ${error.message}`);
      });
    }

    transaction.registerEffect(effect);
  }

  protected abstract createTransaction(): Promise<TransactionType>;
  protected abstract processTransaction<Response>(
    transaction: TransactionType,
    callback: (transaction: TransactionType) => Promise<Response>,
  ): Promise<Response>;
  protected abstract endTransaction(transaction: TransactionType): Promise<void>;

  private async runSuccessfulCommitEffects(transaction: TransactionType) {
    const effects = transaction.getEffects();

    if (!effects?.length) {
      return;
    }

    for (const effect of effects) {
      try {
        await effect();
      } catch (error: unknown) {
        if (error instanceof Error) {
          Logger.error(`Transaction effect error for session ${transaction.getId()}: ${error.message}`);
        }
      }
    }
  }
}
