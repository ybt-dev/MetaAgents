import { Injectable } from '@nestjs/common';
import { InteractionMessageDto } from '@apps/platform/agents/dto';
import { InteractionMessageEntity } from '@apps/platform/agents/entities';

export interface InteractionMessageEntityToDtoMapper {
  mapOne(entity: InteractionMessageEntity): InteractionMessageDto;
  mapMany(entities: InteractionMessageEntity[]): InteractionMessageDto[];
}

@Injectable()
export class DefaultInteractionMessageEntityToDtoMapper implements InteractionMessageEntityToDtoMapper {
  public mapOne(entity: InteractionMessageEntity): InteractionMessageDto {
    return {
      id: entity.getId(),
      interactionId: entity.getInteractionId(),
      sourceActor: entity.getSourceActor(),
      repliedToMessageId: entity.getRepliedToMessageId(),
      content: entity.getContent(),
      teamId: entity.getTeamId(),
      organizationId: entity.getOrganizationId(),
      createdAt: entity.getCreatedAt(),
    };
  }

  public mapMany(entities: InteractionMessageEntity[]): InteractionMessageDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
