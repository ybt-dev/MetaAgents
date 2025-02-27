import { Injectable } from '@nestjs/common';
import { InteractionMessageRepository } from '@apps/platform/agents/repositories';
import { InteractionMessageEntityToDtoMapper } from '@apps/platform/agents/entities-mappers';
import { InteractionMessageDto } from '@apps/platform/agents/dto';
import {
  InjectInteractionMessageRepository,
  InjectInteractionMessageEntityToDtoMapper,
} from '@apps/platform/agents/decorators';
import { InteractionMessageActor } from '@apps/platform/agents/types';

export interface CreateInteractionMessageParams {
  messageId?: string;
  interactionId: string;
  teamId: string;
  organizationId: string;
  content: string;
  sourceActor: InteractionMessageActor;
  repliedToMessageId?: string;
}

export interface InteractionMessageService {
  listByInteractionId(interactionId: string, organizationId: string): Promise<InteractionMessageDto[]>;
  create(params: CreateInteractionMessageParams): Promise<InteractionMessageDto>;
}

@Injectable()
export class DefaultInteractionMessageService implements InteractionMessageService {
  constructor(
    @InjectInteractionMessageRepository()
    private readonly interactionMessageRepository: InteractionMessageRepository,
    @InjectInteractionMessageEntityToDtoMapper()
    private readonly interactionMessageEntityToDtoMapper: InteractionMessageEntityToDtoMapper,
  ) {}

  public async listByInteractionId(interactionId: string, organizationId: string): Promise<InteractionMessageDto[]> {
    const messageEntities = await this.interactionMessageRepository.findMany({
      interactionId,
      organizationId,
    });

    return this.interactionMessageEntityToDtoMapper.mapMany(messageEntities);
  }

  public async create(params: CreateInteractionMessageParams): Promise<InteractionMessageDto> {
    const messageEntity = await this.interactionMessageRepository.createOne({
      id: params.messageId,
      interaction: params.interactionId,
      team: params.teamId,
      organization: params.organizationId,
      repliedToMessageId: params.repliedToMessageId,
      content: params.content,
      sourceActor: params.sourceActor,
    });

    return this.interactionMessageEntityToDtoMapper.mapOne(messageEntity);
  }
}
