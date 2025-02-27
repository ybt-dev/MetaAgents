import { Inject } from '@nestjs/common';
import SqsConsumersModuleTokens from '@libs/sqs-consumers/sqs-consumers.module.tokens';

const InjectConsumersConfig = () => {
  return Inject(SqsConsumersModuleTokens.ConsumersConfig);
};

export default InjectConsumersConfig;
