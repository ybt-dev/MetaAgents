import { Inject } from '@nestjs/common';
import SessionsModuleTokens from '@apps/platform/sessions/sessions.module.tokens';

const InjectSessionService = () => {
  return Inject(SessionsModuleTokens.Services.SessionService);
};

export default InjectSessionService;
