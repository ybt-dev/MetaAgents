import { Injectable } from '@nestjs/common';
import { AgentMessageDto } from '@apps/platform/agents/dto';
import { AgentMessageEntity } from '@apps/platform/agents/entities';

export interface AgentMessageEntityToDtoMapper {
  mapOne(entity: AgentMessageEntity): AgentMessageDto;
  mapMany(entities: AgentMessageEntity[]): AgentMessageDto[];
}

@Injectable()
export class DefaultAgentMessageEntityToDtoMapper implements AgentMessageEntityToDtoMapper {
  public mapOne(entity: AgentMessageEntity): AgentMessageDto {
    return {
      id: entity.getId(),
      interactionId: entity.getInteractionId(),
      sourceAgentId: entity.getSourceAgentId(),
      targetAgentId: entity.getTargetAgentId(),
      content: entity.getContent(),
      teamId: entity.getTeamId(),
      organizationId: entity.getOrganizationId(),
      createdAt: entity.getCreatedAt(),
    };
  }

  public mapMany(entities: AgentMessageEntity[]): AgentMessageDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
