import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentTeamRepository = () => {
  return Inject(AgentsModuleTokens.Repositories.AgentTeamRepository);
};

export default InjectAgentTeamRepository;
