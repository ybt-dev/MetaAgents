import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentTeamInteractionEntityToDtoMapper = () => {
  return Inject(AgentsModuleTokens.EntityMappers.AgentTeamInteractionEntityToDtoMapper);
};

export default InjectAgentTeamInteractionEntityToDtoMapper;
