import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentEntityToDtoMapper = () => {
  return Inject(AgentsModuleTokens.EntityMappers.AgentEntityToDtoMapper);
};

export default InjectAgentEntityToDtoMapper;
