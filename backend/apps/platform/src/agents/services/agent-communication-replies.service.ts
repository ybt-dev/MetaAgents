import { Injectable } from '@nestjs/common';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { InjectDeduplicationService } from '@libs/deduplication/decorators';
import { DeduplicationService } from '@libs/deduplication/services';
import { InjectInteractionMessageService } from '@apps/platform/agents/decorators';
import { InteractionMessageService } from './interaction-message.service';
import { InteractionMessageActorType } from '@apps/platform/agents/enums';

export interface SaveAgentCommunicationReplyParams {
  messageId: string;
  agentId: string;
  interactionId: string;
  teamId: string;
  organizationId: string;
  repliedToMessageId: string;
  text: string;
  actionText?: string;
  deduplicationId: string;
}

export interface AgentCommunicationRepliesService {
  saveReply(params: SaveAgentCommunicationReplyParams): Promise<void>;
}

@Injectable()
export class DefaultAgentCommunicationRepliesService implements AgentCommunicationRepliesService {
  constructor(
    @InjectInteractionMessageService() private readonly interactionMessageService: InteractionMessageService,
    @InjectDeduplicationService() private readonly deduplicationService: DeduplicationService,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async saveReply(params: SaveAgentCommunicationReplyParams) {
    return this.transactionsManager.useTransaction(async () => {
      await this.deduplicationService.createDeduplicationRecord(`communication-reply:${params.deduplicationId}`);

      const sourceActor = {
        type: InteractionMessageActorType.Agent,
        id: params.agentId,
      };

      await this.interactionMessageService.create({
        messageId: params.messageId,
        interactionId: params.interactionId,
        teamId: params.teamId,
        organizationId: params.organizationId,
        repliedToMessageId: params.repliedToMessageId,
        content: params.text,
        sourceActor,
      });

      if (params.actionText) {
        await this.interactionMessageService.create({
          interactionId: params.interactionId,
          teamId: params.teamId,
          organizationId: params.organizationId,
          content: params.actionText,
          sourceActor,
        });
      }
    });
  }
}
