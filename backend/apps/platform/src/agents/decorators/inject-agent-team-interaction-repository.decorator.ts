import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentTeamInteractionRepository = () => {
  return Inject(AgentsModuleTokens.Repositories.AgentTeamInteractionRepository);
};

export default InjectAgentTeamInteractionRepository;
