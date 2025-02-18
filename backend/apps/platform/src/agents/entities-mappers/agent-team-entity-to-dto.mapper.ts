import { Injectable } from '@nestjs/common';
import { AgentTeamEntity } from '@apps/platform/agents/entities';
import { AgentTeamDto } from '@apps/platform/agents/dto';

export interface AgentTeamEntityToDtoMapper {
  mapOne(entity: AgentTeamEntity): AgentTeamDto;
  mapMany(entities: AgentTeamEntity[]): AgentTeamDto[];
}

@Injectable()
export class DefaultAgentTeamEntityToDtoMapper implements AgentTeamEntityToDtoMapper {
  public mapOne(entity: AgentTeamEntity): AgentTeamDto {
    return {
      id: entity.getId(),
      strategy: entity.getStrategy(),
      organizationId: entity.getOrganizationId(),
      name: entity.getName(),
      description: entity.getDescription(),
      imageUrl: entity.getImageUrl(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
      createdById: entity.getCreatedById(),
      updatedById: entity.getUpdatedById(),
    };
  }

  public mapMany(entities: AgentTeamEntity[]): AgentTeamDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
