import { Inject } from '@nestjs/common';
import TransactionsModuleTokens from '@libs/transactions/transactions.module.tokens';

const InjectTransactionsManager = () => {
  return Inject(TransactionsModuleTokens.Managers.TransactionsManager);
};

export default InjectTransactionsManager;
