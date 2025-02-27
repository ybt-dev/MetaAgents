import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectEventsService } from '@libs/events/decorators';
import { EventsService } from '@libs/events/services';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { AgentTeamInteractionRepository, AgentTeamRepository } from '@apps/platform/agents/repositories';
import { AgentTeamInteractionEntityToDtoMapper } from '@apps/platform/agents/entities-mappers';
import { AgentTeamInteractionDto } from '@apps/platform/agents/dto';
import {
  InjectAgentService,
  InjectAgentTeamInteractionEntityToDtoMapper,
  InjectAgentTeamInteractionRepository,
  InjectAgentTeamRepository,
  InjectInteractionMessageService,
} from '@apps/platform/agents/decorators';
import { AgentRole, InteractionMessageActorType } from '@apps/platform/agents/enums';
import { generateAgentCommunicationRequestedEvent } from '@apps/platform/agents/utils';
import { AgentService } from './agent.service';
import { InteractionMessageService } from './interaction-message.service';

export interface CreateAgentTeamInteractionParams {
  title: string;
  requestContent: string;
  teamId: string;
  organizationId: string;
  createdById?: string;
}

export interface SendReplyMessageToInteractionParams {
  replyMessageId: string;
  interactionId: string;
  organizationId: string;
  createdById?: string;
  content: string;
}

export interface AgentTeamInteractionService {
  listByTeam(teamId: string, organizationId: string): Promise<AgentTeamInteractionDto[]>;
  get(id: string, organizationId: string): Promise<AgentTeamInteractionDto | null>;
  getIfExist(id: string, organizationId: string): Promise<AgentTeamInteractionDto>;
  create(params: CreateAgentTeamInteractionParams): Promise<AgentTeamInteractionDto>;
  sendReplyMessage(params: SendReplyMessageToInteractionParams): Promise<void>;
}

@Injectable()
export class DefaultAgentTeamInteractionService implements AgentTeamInteractionService {
  constructor(
    @InjectAgentTeamInteractionRepository()
    private readonly agentTeamInteractionRepository: AgentTeamInteractionRepository,
    @InjectAgentTeamRepository()
    private readonly agentTeamRepository: AgentTeamRepository,
    @InjectAgentService() private readonly agentService: AgentService,
    @InjectAgentTeamInteractionEntityToDtoMapper()
    private readonly agentTeamInteractionEntityToDtoMapper: AgentTeamInteractionEntityToDtoMapper,
    @InjectInteractionMessageService() private readonly interactionMessageService: InteractionMessageService,
    @InjectEventsService() private readonly eventsService: EventsService,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async listByTeam(teamId: string, organizationId: string): Promise<AgentTeamInteractionDto[]> {
    const entities = await this.agentTeamInteractionRepository.findMany({
      teamId,
      organizationId,
    });

    return this.agentTeamInteractionEntityToDtoMapper.mapMany(entities);
  }

  public async get(id: string, organizationId: string): Promise<AgentTeamInteractionDto> {
    const agentTeamInteractionEntity = await this.agentTeamInteractionRepository.findByIdAndOrganizationId(
      id,
      organizationId,
    );

    return agentTeamInteractionEntity && this.agentTeamInteractionEntityToDtoMapper.mapOne(agentTeamInteractionEntity);
  }

  public async getIfExist(id: string, organizationId: string): Promise<AgentTeamInteractionDto> {
    const agentTeamInteraction = await this.get(id, organizationId);

    if (!agentTeamInteraction) {
      throw new NotFoundException(`Agent team interaction with id ${id} not found`);
    }

    return agentTeamInteraction;
  }

  public async create(params: CreateAgentTeamInteractionParams): Promise<AgentTeamInteractionDto> {
    const team = await this.agentTeamRepository.findByIdAndOrganizationId(params.teamId, params.organizationId);

    if (!team) {
      throw new UnprocessableEntityException(`Team with id ${params.teamId} not found`);
    }

    const [producerAgent] = await this.agentService.listForTeam(params.teamId, params.organizationId, [
      AgentRole.Producer,
    ]);

    if (!producerAgent) {
      throw new UnprocessableEntityException('Team should have a producer to initiate a interaction.');
    }

    return this.transactionsManager.useTransaction(async () => {
      const entity = await this.agentTeamInteractionRepository.createOne({
        title: params.title,
        team: params.teamId,
        organization: params.organizationId,
        createdBy: params.createdById,
      });

      const agentTeamInteraction = this.agentTeamInteractionEntityToDtoMapper.mapOne(entity);

      const message = await this.interactionMessageService.create({
        interactionId: agentTeamInteraction.id,
        teamId: params.teamId,
        organizationId: params.organizationId,
        content: params.requestContent,
        sourceActor: {
          id: params.createdById ?? agentTeamInteraction.id,
          type: InteractionMessageActorType.User,
        },
      });

      await this.eventsService.create(
        generateAgentCommunicationRequestedEvent(agentTeamInteraction, message, producerAgent.id),
      );

      return agentTeamInteraction;
    });
  }

  public async sendReplyMessage(params: SendReplyMessageToInteractionParams) {
    return this.transactionsManager.useTransaction(async () => {
      const interaction = await this.getIfExist(params.interactionId, params.organizationId);

      if (!interaction.repliesQueue.includes(params.replyMessageId)) {
        throw new UnprocessableEntityException('Message is not in the replies queue.');
      }

      const [producerAgent] = await this.agentService.listForTeam(interaction.teamId, params.organizationId, [
        AgentRole.Producer,
      ]);

      if (!producerAgent) {
        throw new UnprocessableEntityException('Team should have a producer to send a message.');
      }

      const message = await this.interactionMessageService.create({
        interactionId: interaction.id,
        teamId: interaction.teamId,
        organizationId: params.organizationId,
        content: params.content,
        sourceActor: {
          id: params.createdById ?? interaction.id,
          type: InteractionMessageActorType.User,
        },
        repliedToMessageId: params.replyMessageId,
      });

      await this.agentTeamInteractionRepository.removeMessageIdFromRepliesQueue(interaction.id, params.replyMessageId);

      await this.eventsService.create(generateAgentCommunicationRequestedEvent(interaction, message, producerAgent.id));
    });
  }
}
