import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectElizaApi = () => {
  return Inject(AgentsModuleTokens.Api.ElizaApi);
};

export default InjectElizaApi;
