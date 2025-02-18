import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentTeamInteractionService = () => {
  return Inject(AgentsModuleTokens.Services.AgentTeamInteractionService);
};

export default InjectAgentTeamInteractionService;
