import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentWalletGeneratorService = () => {
  return Inject(AgentsModuleTokens.Services.AgentWalletGeneratorService);
};

export default InjectAgentWalletGeneratorService;
