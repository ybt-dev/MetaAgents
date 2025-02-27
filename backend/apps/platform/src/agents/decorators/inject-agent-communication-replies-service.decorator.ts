import { Inject } from '@nestjs/common';
import AgentsModuleTokens from '@apps/platform/agents/agents.module.tokens';

const InjectAgentCommunicationRepliesServiceService = () => {
  return Inject(AgentsModuleTokens.Services.AgentCommunicationRepliesServiceService);
};

export default InjectAgentCommunicationRepliesServiceService;
