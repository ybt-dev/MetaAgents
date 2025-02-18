import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentMessageService = () => {
  return Inject(AgentsModuleTokens.Services.AgentMessageService);
};

export default InjectAgentMessageService;
