import { Injectable } from '@nestjs/common';
import { AgentMessageRepository } from '@apps/platform/agents/repositories';
import { AgentMessageEntityToDtoMapper } from '@apps/platform/agents/entities-mappers';
import { AgentMessageDto } from '@apps/platform/agents/dto';
import { InjectAgentMessageRepository, InjectAgentMessageEntityToDtoMapper } from '@apps/platform/agents/decorators';

export interface AgentMessageService {
  listByInteractionId(interactionId: string, organizationId: string): Promise<AgentMessageDto[]>;
}

@Injectable()
export class DefaultAgentMessageService implements AgentMessageService {
  constructor(
    @InjectAgentMessageRepository()
    private readonly agentMessageRepository: AgentMessageRepository,
    @InjectAgentMessageEntityToDtoMapper()
    private readonly agentMessageEntityToDtoMapper: AgentMessageEntityToDtoMapper,
  ) {}

  public async listByInteractionId(interactionId: string, organizationId: string): Promise<AgentMessageDto[]> {
    const messageEntities = await this.agentMessageRepository.findMany({
      interactionId,
      organizationId,
    });

    return this.agentMessageEntityToDtoMapper.mapMany(messageEntities);
  }
}
