import { IsIdentifier } from '@libs/validation/class-validators';
import { IsNotEmpty } from 'class-validator';

export interface AgentMessageDto {
  id: string;
  teamId: string;
  interactionId: string;
  sourceAgentId: string;
  targetAgentId: string;
  organizationId: string;
  content: string;
  createdAt: Date;
}

export class ListAgentMessagesQueryDto {
  @IsIdentifier()
  @IsNotEmpty()
  interactionId: string;
}
