import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectInteractionMessageEntityToDtoMapper = () => {
  return Inject(AgentsModuleTokens.EntityMappers.InteractionMessageEntityToDtoMapper);
};

export default InjectInteractionMessageEntityToDtoMapper;
