import {
  composeContext,
  Content,
  generateMessageResponse,
  getEmbeddingZeroVector,
  Memory,
  ModelClass,
  stringToUuid,
} from '@elizaos/core';
import { Agent } from '../stores/agents.store.ts';
import { Consumer, ConsumerMessage, Event, Publisher } from '../types';
import { AgentsManager } from '../managers/agents.manager.ts';
import { ConsumerFactory } from '../factories/consumer.factory.ts';
import { PublisherFactory } from '../factories/publisher.factory.ts';
import { IdGenerationHelper } from '../helpers/id-generation.helper.ts';
import PublisherName from '../enums/publisher-name.enum.ts';
import ConsumerName from '../enums/consumer-name.enum.ts';
import AgentTeamInteractionsEventType from '../enums/agent-team-interactions-event-type.enum.ts';
import AgentsEventCategory from '../enums/agents-event-category.enum.ts';
import { defaultInteractionsTemplate } from './templates/interactions.template.ts';

export interface AgentCommunicationRequestedEventData {
  triggerMessageId: string;
  targetAgentId: string;
  teamId: string;
  organizationId: string;
  interactionId: string;
  text: string;
  origin: string;
  senderName: string;
  fromAgentId?: string;
  inReplyTo?: string;
}

export type AgentCommunicationRequestedEvent = Event<
  AgentTeamInteractionsEventType.AgentCommunicationRequested,
  AgentCommunicationRequestedEventData
>;

export default class InteractionsClient {
  private CLIENT_SOURCE = 'interactions';

  private consumer: Consumer;
  private publisher: Publisher;

  constructor(
    private agentsManager: AgentsManager,
    private consumerFactory: ConsumerFactory,
    private publisherFactory: PublisherFactory,
    private idGenerationHelper: IdGenerationHelper,
  ) {}

  public async start() {
    this.consumer = this.consumerFactory.createConsumer(
      ConsumerName.Interactions,
      this.handleConsumerMessage.bind(this),
    );

    this.publisher = this.publisherFactory.createPublisher(PublisherName.InteractionResponse);

    await this.consumer.start();
  }

  public async stop() {
    await this.consumer.stop();
  }

  private handleConsumerMessage(message: ConsumerMessage) {
    return this.handleCommunicationEvent(message.payload as AgentCommunicationRequestedEvent);
  }

  private async handleCommunicationEvent(event: AgentCommunicationRequestedEvent) {
    const {
      data: { interactionId, text, triggerMessageId, senderName, targetAgentId, fromAgentId, inReplyTo },
    } = event;

    const interactionRoomId = stringToUuid(interactionId);
    const userId = stringToUuid(fromAgentId ?? interactionId);

    const agent = this.agentsManager.getAgent(targetAgentId);

    if (!agent) {
      return;
    }

    await agent.runtime.ensureConnection(userId, interactionRoomId, senderName, senderName, this.CLIENT_SOURCE);

    const content: Content = {
      text,
      attachments: [],
      source: this.CLIENT_SOURCE,
      inReplyTo: inReplyTo ? stringToUuid(inReplyTo) : undefined,
    };

    const userMessage = {
      content,
      userId,
      roomId: interactionRoomId,
      agentId: agent.runtime.agentId,
    };

    const memoryId = stringToUuid(`${triggerMessageId}-${targetAgentId}`);

    const existingMemory = await agent.runtime.messageManager.getMemoryById(memoryId);

    const memoryToUse = existingMemory ?? {
      ...userMessage,
      id: memoryId,
      agentId: agent.runtime.agentId,
      roomId: interactionRoomId,
      userId,
      content,
      createdAt: Date.now(),
    };

    if (!existingMemory) {
      await this.createMemory(agent, memoryToUse);
    }

    const state = await agent.runtime.composeState(userMessage, {
      agentName: agent.runtime.character.name,
      interactionId,
      triggerMessageId: memoryId,
      systemMessage: agent.runtime.character.system,
    });

    const context = composeContext({ state, template: defaultInteractionsTemplate });

    const response = await generateMessageResponse({
      runtime: agent.runtime,
      context,
      modelClass: ModelClass.LARGE,
    });

    const responseMessageId = this.idGenerationHelper.generateId();

    const responseMessage = {
      ...userMessage,
      id: stringToUuid(responseMessageId),
      userId: agent.runtime.agentId,
      content: response,
      embedding: getEmbeddingZeroVector(),
      createdAt: Date.now(),
    };

    await this.createMemory(agent, responseMessage);

    const updatedState = await agent.runtime.updateRecentMessageState(state);

    updatedState.responseMessageId = responseMessageId;

    let actionMessage: Content | null = null;

    await agent.runtime.processActions(memoryToUse, [responseMessage], updatedState, async (newMessages) => {
      actionMessage = newMessages;

      return [memoryToUse];
    });

    const eventId = stringToUuid(`${triggerMessageId}-${targetAgentId}-reply`);

    await agent.runtime.evaluate(memoryToUse, updatedState);

    await this.publisher.publish({
      deduplicationId: eventId,
      data: {
        id: eventId,
        type: AgentTeamInteractionsEventType.AgentCommunicationReplied,
        category: AgentsEventCategory.AgentTeamInteractions,
        userId: null,
        createdAt: new Date(),
        data: {
          messageId: responseMessageId,
          interactionId,
          agentId: targetAgentId,
          teamId: agent.configuration.teamId,
          organizationId: agent.configuration.organizationId,
          repliedToMessageId: triggerMessageId,
          text: response.text ?? 'Unable to extract a response text',
          actionText: actionMessage?.text ?? '',
        },
      },
    });
  }

  private async createMemory(agent: Agent, memory: Memory) {
    await agent.runtime.messageManager.addEmbeddingToMemory(memory);
    await agent.runtime.messageManager.createMemory(memory, false);
  }
}
