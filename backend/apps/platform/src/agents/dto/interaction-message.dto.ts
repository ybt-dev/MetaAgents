import { IsIdentifier } from '@libs/validation/class-validators';
import { IsNotEmpty } from 'class-validator';
import { InteractionMessageActor } from '@apps/platform/agents/types';

export interface InteractionMessageDto {
  id: string;
  teamId: string;
  interactionId: string;
  sourceActor: InteractionMessageActor;
  repliedToMessageId?: string;
  organizationId: string;
  content: string;
  createdAt: Date;
}

export class ListInteractionMessagesQueryDto {
  @IsIdentifier()
  @IsNotEmpty()
  interactionId: string;
}
