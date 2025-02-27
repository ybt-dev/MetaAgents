import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectInteractionMessageRepository = () => {
  return Inject(AgentsModuleTokens.Repositories.InteractionMessageRepository);
};

export default InjectInteractionMessageRepository;
