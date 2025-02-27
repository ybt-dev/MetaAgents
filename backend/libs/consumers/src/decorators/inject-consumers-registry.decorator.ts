import { Inject } from '@nestjs/common';
import ConsumersModuleTokens from '@libs/consumers/consumers.module.tokens';

const InjectConsumersRegistry = () => {
  return Inject(ConsumersModuleTokens.ConsumersRegistry);
};

export default InjectConsumersRegistry;
