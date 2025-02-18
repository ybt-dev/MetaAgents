import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentRepository = () => {
  return Inject(AgentsModuleTokens.Repositories.AgentRepository);
};

export default InjectAgentRepository;
