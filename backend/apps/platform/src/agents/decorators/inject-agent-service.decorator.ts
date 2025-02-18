import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentService = () => {
  return Inject(AgentsModuleTokens.Services.AgentService);
};

export default InjectAgentService;
