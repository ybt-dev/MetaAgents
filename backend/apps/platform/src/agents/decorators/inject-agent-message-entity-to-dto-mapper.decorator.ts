import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentMessageEntityToDtoMapper = () => {
  return Inject(AgentsModuleTokens.EntityMappers.AgentMessageEntityToDtoMapper);
};

export default InjectAgentMessageEntityToDtoMapper;
