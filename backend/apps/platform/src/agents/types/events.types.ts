import { Event } from '@libs/events/types';
import { AgentDto } from '@apps/platform/agents/dto';
import { InteractionMessageActorType } from '@apps/platform/agents/enums';

export interface AgentCreatedEventData {
  object: AgentDto;
}

export interface AgentUpdatedEventData {
  previousObject: AgentDto;
  object: AgentDto;
}

export interface AgentCommunicationRequestedEventData {
  triggerMessageId: string;
  targetAgentId: string;
  teamId: string;
  organizationId: string;
  interactionId: string;
  text: string;
  origin: InteractionMessageActorType;
  senderName: string;
  fromAgentId?: string;
  inReplyTo?: string;
}

export interface AgentCommunicationRepliedEventData {
  messageId: string;
  agentId: string;
  teamId: string;
  organizationId: string;
  interactionId: string;
  repliedToMessageId: string;
  text: string;
  actionText?: string;
}

export type AgentCommunicationRepliedEvent = Event<string, AgentCommunicationRepliedEventData>;
