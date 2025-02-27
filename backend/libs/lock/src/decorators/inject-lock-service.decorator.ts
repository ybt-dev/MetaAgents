import { Inject } from '@nestjs/common';
import LockModuleTokens from '@libs/lock/lock.module.tokens';

const InjectLockService = () => {
  return Inject(LockModuleTokens.Services.LockService);
};

export default InjectLockService;
