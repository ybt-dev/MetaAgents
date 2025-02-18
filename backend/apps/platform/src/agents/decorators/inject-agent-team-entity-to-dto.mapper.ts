import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentTeamEntityToDtoMapper = () => {
  return Inject(AgentsModuleTokens.EntityMappers.AgentTeamEntityToDtoMapper);
};

export default InjectAgentTeamEntityToDtoMapper;
