import { IsNotEmpty, IsString } from 'class-validator';

export interface AgentTeamDto {
  id: string;
  name: string;
  strategy: string;
  description: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  createdById?: string | null;
  updatedById?: string | null;
}

export class CreateAgentTeamBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsString()
  description: string;
}

export class UpdateAgentTeamBodyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  strategy: string;
}
