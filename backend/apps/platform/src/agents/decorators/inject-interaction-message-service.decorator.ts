import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectInteractionMessageService = () => {
  return Inject(AgentsModuleTokens.Services.InteractionMessageService);
};

export default InjectInteractionMessageService;
