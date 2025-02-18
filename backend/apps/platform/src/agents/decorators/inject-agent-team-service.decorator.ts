import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentTeamService = () => {
  return Inject(AgentsModuleTokens.Services.AgentTeamService);
};

export default InjectAgentTeamService;
