import { Injectable } from '@nestjs/common';
import { AgentTeamInteractionEntity } from '@apps/platform/agents/entities';
import { AgentTeamInteractionDto } from '@apps/platform/agents/dto';

export interface AgentTeamInteractionEntityToDtoMapper {
  mapOne(entity: AgentTeamInteractionEntity): AgentTeamInteractionDto;
  mapMany(entities: AgentTeamInteractionEntity[]): AgentTeamInteractionDto[];
}

@Injectable()
export class DefaultAgentTeamInteractionEntityToDtoMapper implements AgentTeamInteractionEntityToDtoMapper {
  public mapOne(entity: AgentTeamInteractionEntity): AgentTeamInteractionDto {
    return {
      id: entity.getId(),
      title: entity.getTitle(),
      requestContent: entity.getRequestContent(),
      teamId: entity.getTeamId(),
      organizationId: entity.getOrganizationId(),
      status: entity.getStatus(),
      createdById: entity.getCreatedById(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }

  public mapMany(entities: AgentTeamInteractionEntity[]): AgentTeamInteractionDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
