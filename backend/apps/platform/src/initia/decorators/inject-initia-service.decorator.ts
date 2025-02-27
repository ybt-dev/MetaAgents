import { Inject } from '@nestjs/common';
import InitiaModuleTokens from '../initia.module.tokens';

const InjectSessionService = () => {
  return Inject(InitiaModuleTokens.Services.InitiaService);
};

export default InjectSessionService;
