import { IsString, IsNotEmpty } from 'class-validator';
import { IsIdentifier } from '@libs/validation/class-validators';

export interface AgentTeamInteractionDto {
  id: string;
  title: string;
  teamId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string | null;
  lockedTill?: Date | string | null;
}

export class ListAgentTeamInteractionsQueryDto {
  @IsIdentifier()
  @IsNotEmpty()
  teamId: string;
}

export class CreateAgentTeamInteractionBodyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  requestContent: string;

  @IsIdentifier()
  @IsNotEmpty()
  teamId: string;
}

export class SendReplyMessageToInteractionBodyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
