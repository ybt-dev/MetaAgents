import { CreateEventParams } from '@libs/events/services';
import {
  AgentsEventCategory,
  AgentTeamInteractionsEventType,
  AgentEventType,
  InteractionMessageActorType,
} from '@apps/platform/agents/enums';
import { AgentDto, AgentTeamInteractionDto, InteractionMessageDto } from '@apps/platform/agents/dto';
import {
  AgentCommunicationRequestedEventData,
  AgentCreatedEventData,
  AgentDeletedEventData,
  AgentUpdatedEventData,
} from '@apps/platform/agents/types';

export const generateAgentCommunicationRequestedEvent = (
  agentTeamInteraction: AgentTeamInteractionDto,
  message: InteractionMessageDto,
  producerAgentId: string,
): CreateEventParams<AgentCommunicationRequestedEventData> => {
  return {
    type: AgentTeamInteractionsEventType.AgentCommunicationRequested,
    category: AgentsEventCategory.AgentTeamInteractions,
    data: {
      triggerMessageId: message.id,
      targetAgentId: producerAgentId,
      interactionId: agentTeamInteraction.id,
      organizationId: agentTeamInteraction.organizationId,
      teamId: agentTeamInteraction.teamId,
      text: message.content,
      origin: InteractionMessageActorType.User,
      senderName: 'User',
      inReplyTo: message.repliedToMessageId,
    },
    userId: agentTeamInteraction.createdById,
  };
};

export const generateAgentCreatedEvent = (agent: AgentDto): CreateEventParams<AgentCreatedEventData> => {
  return {
    type: AgentEventType.AgentCreated,
    category: AgentsEventCategory.Agents,
    data: {
      object: agent,
    },
    userId: agent.createdById,
  };
};

export const generateAgentUpdatedEvent = (
  previousAgent: AgentDto,
  updatedAgent: AgentDto,
): CreateEventParams<AgentUpdatedEventData> => {
  return {
    type: AgentEventType.AgentUpdated,
    category: AgentsEventCategory.Agents,
    data: {
      previousObject: previousAgent,
      object: updatedAgent,
    },
    userId: updatedAgent.updatedById,
  };
};

export const generateAgentDeletedEvent = (agent: AgentDto): CreateEventParams<AgentDeletedEventData> => {
  return {
    type: AgentEventType.AgentDeleted,
    category: AgentsEventCategory.Agents,
    data: {
      object: agent,
    },
    userId: agent.updatedById,
  };
};
