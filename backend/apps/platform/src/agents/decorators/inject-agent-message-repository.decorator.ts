import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentMessageRepository = () => {
  return Inject(AgentsModuleTokens.Repositories.AgentMessageRepository);
};

export default InjectAgentMessageRepository;
