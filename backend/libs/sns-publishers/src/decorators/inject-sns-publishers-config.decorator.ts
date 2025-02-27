import { Inject } from '@nestjs/common';
import SnsPublishersModuleTokens from '@libs/sns-publishers/sns-publishers.module.tokens';

const InjectSnsPublishersConfig = () => {
  return Inject(SnsPublishersModuleTokens.Configs.SnsPublishersConfig);
};

export default InjectSnsPublishersConfig;
