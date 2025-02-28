import {
  composeContext,
  generateText,
  ModelClass,
  Evaluator,
  IAgentRuntime,
  Memory,
  State,
  stringToUuid,
} from '@elizaos/core';
import PublisherName from '../../../enums/publisher-name.enum.ts';
import { Publisher } from '../../../types';
import { PublisherFactory } from '../../../factories/publisher.factory.ts';
import { AgentsManager } from '../../../managers/agents.manager.ts';
import { AgentConfigurationsRepository } from '../../../repositories/agent-configurations.repository.ts';
import { communicationTemplate } from '../templates/evaluator.templates.ts';
import AgentTeamInteractionsEventType from '../../../enums/agent-team-interactions-event-type.enum.ts';
import AgentsEventCategory from '../../../enums/agents-event-category.enum.ts';
import { AgentTeamInteractionsRepository } from '../../../repositories/agent-team-interactions.repository.ts';

export interface ExtractedCommunicationRequest {
  actorId: string | 'user';
  text: string;
}

export default class InteractionsEvaluator implements Evaluator {
  public name = 'INTERACTIONS_EVALUATOR';
  public similes = [
    'COMMUNICATION_EVALUATOR',
    'REQUEST_INFORMATION',
    'SEEK_ASSISTANCE',
    'COMMUNICATION_REQUEST',
    'COORDINATE_INTERACTIONS',
  ];

  public description =
    'Analyzes conversations to identify direct mentions in the last message and prepares appropriate responses based on the context. Handles both agent and user mentions.';
  public alwaysRun = true;
  public examples = [
    {
      context: `Actors in the scene:
  {{user1}}: Marketing Manager.
  {{user2}}: influencer`,
      messages: [
        {
          user: '{{user1}}',
          content: {
            text: '@influencer Can you help boost our social media presence?',
          },
        },
      ],
      outcome: `[
        {
          "actorId": "influencer",
          "text": "Assist with boosting social media presence."
        }
      ]`,
    },
    {
      context: `Actors in the scene:
  {{user1}}: Project Manager.
  {{user2}}: producer`,
      messages: [
        {
          user: '{{user1}}',
          content: {
            text: '@producer We need an update on the latest content schedule.',
          },
        },
      ],
      outcome: `[
        {
          "actorId": "producer",
          "text": "Provide an update on the latest content schedule."
        }
      ]`,
    },
    {
      context: `Actors in the scene:
  {{user1}}: Business Consultant.
  {{user2}}: adviser`,
      messages: [
        {
          user: '{{user1}}',
          content: {
            text: '@adviser What are the potential risks of entering this new market?',
          },
        },
      ],
      outcome: `[
        {
          "actorId": "adviser",
          "text": "Provide an analysis of potential market entry risks."
        }
      ]`,
    },
    {
      context: `Actors in the scene:
  {{user1}}: Customer Service Rep.
  {{user2}}: @user`,
      messages: [
        {
          user: '{{user1}}',
          content: {
            text: '@user We need your feedback on the latest service update.',
          },
        },
      ],
      outcome: `[
        {
          "actorId": "user",
          "text": "Provide feedback on the latest service update."
        }
      ]`,
    },
  ];

  private publisher: Publisher;

  constructor(
    private agentConfigurationsRepository: AgentConfigurationsRepository,
    private agentTeamInteractionsRepository: AgentTeamInteractionsRepository,
    private agentsManager: AgentsManager,
    private publisherFactory: PublisherFactory,
    private allowUserMentions: boolean = true,
  ) {
    this.publisher = this.publisherFactory.createPublisher(PublisherName.AgentsCommunication);
  }

  public async validate(): Promise<boolean> {
    return true;
  }

  public async handler(runtime: IAgentRuntime, message: Memory, state: State): Promise<void> {
    try {
      // TODO IMPROVE EVALUATION LOGIC
      const composedState = state ?? (await runtime.composeState(message));

      const interactionId = composedState.interactionId as string;
      const responseMessageId = composedState.responseMessageId as string;

      if (!interactionId || !responseMessageId) {
        return;
      }

      const context = composeContext({
        state: composedState,
        template: communicationTemplate,
      });

      const response = await generateText({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
      });

      const requests = JSON.parse(response.trim()) as ExtractedCommunicationRequest[];

      if (!requests) {
        return;
      }

      for (const request of requests) {
        if (request.actorId === 'user' && this.allowUserMentions) {
          await this.agentTeamInteractionsRepository.addMessageIdToRepliesQueue(responseMessageId, interactionId);

          continue;
        }

        const targetAgent = await this.agentsManager.getAgent(request.actorId);

        if (!targetAgent) {
          continue;
        }

        const eventId = stringToUuid(`${responseMessageId}-${request.actorId}-communication-request`);

        await this.publisher.publish({
          deduplicationId: eventId,
          data: {
            id: eventId,
            type: AgentTeamInteractionsEventType.AgentCommunicationRequested,
            category: AgentsEventCategory.AgentTeamInteractions,
            userId: null,
            createdAt: new Date(),
            data: {
              interactionId,
              triggerMessageId: responseMessageId,
              targetAgentId: request.actorId,
              organizationId: targetAgent.configuration.organizationId,
              teamId: targetAgent.configuration.teamId,
              text: request.text,
              origin: 'agent',
              senderName: runtime.character.name,
              fromAgentId: runtime.character.id,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error in communication evaluator:', error);

      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
  }
}
