import { Inject } from '@nestjs/common';
import SessionsModuleTokens from '@apps/platform/sessions/sessions.module.tokens';

const InjectSessionNonceRepository = () => {
  return Inject(SessionsModuleTokens.Repositories.SessionNonceRepository);
};

export default InjectSessionNonceRepository;
