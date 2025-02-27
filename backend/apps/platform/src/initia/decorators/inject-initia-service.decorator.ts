import { Inject } from '@nestjs/common';
import InitiaModuleTokens from '../initia.module.tokens';

const InjectInitiaService = () => {
  return Inject(InitiaModuleTokens.Services.InitiaService);
};

export default InjectInitiaService;
