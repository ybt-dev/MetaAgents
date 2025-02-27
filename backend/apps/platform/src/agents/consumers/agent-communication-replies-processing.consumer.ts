import { ConsumerMessage } from '@libs/consumers/types';
import { ConsumerHandler } from '@libs/consumers/decorators';
import { AgentCommunicationRepliedEvent } from '@apps/platform/agents/types';
import { AgentsConsumerName } from '@apps/platform/agents/enums';
import { InjectAgentCommunicationRepliesService } from '@apps/platform/agents/decorators';
import { AgentCommunicationRepliesService } from '@apps/platform/agents/services';

export default class AgentCommunicationRepliesConsumer {
  constructor(
    @InjectAgentCommunicationRepliesService()
    private readonly agentCommunicationRepliesService: AgentCommunicationRepliesService,
  ) {}

  @ConsumerHandler(AgentsConsumerName.AgentCommunicationReplies)
  public async consume(message: ConsumerMessage<AgentCommunicationRepliedEvent>) {
    const { deduplicationId, payload: event } = message;

    await this.agentCommunicationRepliesService.saveReply({ deduplicationId, ...event.data });
  }
}
