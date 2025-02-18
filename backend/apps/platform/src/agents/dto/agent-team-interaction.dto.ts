import { IsString, IsNotEmpty } from 'class-validator';
import { IsIdentifier } from '@libs/validation/class-validators';
import { AgentTeamInteractionStatus } from '@apps/platform/agents/enums';

export interface AgentTeamInteractionDto {
  id: string;
  title: string;
  requestContent: string;
  teamId: string;
  organizationId: string;
  status: AgentTeamInteractionStatus;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string | null;
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
