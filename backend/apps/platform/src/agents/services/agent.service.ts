import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectEncryptionHelper } from '@libs/encryption/decorators';
import { EncryptionHelper } from '@libs/encryption/helpers';
import { InjectEventsService } from '@libs/events/decorators';
import { EventsService } from '@libs/events/services';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { AgentRepository, AgentTeamRepository } from '@apps/platform/agents/repositories';
import {
  InjectAgentRepository,
  InjectAgentEntityToDtoMapper,
  InjectAgentTeamRepository,
  InjectAgentWalletGeneratorService,
} from '@apps/platform/agents/decorators';
import { AgentDto } from '@apps/platform/agents/dto';
import { AgentEntityToDtoMapper } from '@apps/platform/agents/entities-mappers';
import { AgentModel, AgentRole } from '@apps/platform/agents/enums';
import {
  generateAgentCreatedEvent,
  generateAgentUpdatedEvent,
  generateAgentDeletedEvent,
} from '@apps/platform/agents/utils';
import { AgentWalletGeneratorService } from './agent-wallet-generator.service';

export interface CreateAgentParams {
  role: AgentRole;
  organizationId: string;
  model: AgentModel;
  modelApiKey: string;
  teamId: string;
  name: string;
  twitterAuthToken?: string;
  twitterUsername?: string;
  twitterPassword?: string;
  twitterEmail?: string;
  createdById: string;
  description?: string;
}

export interface UpdateAgentParams {
  model?: AgentModel;
  modelApiKey?: string;
  twitterAuthToken?: string;
  twitterUsername?: string;
  twitterPassword?: string;
  twitterEmail?: string;
  name?: string;
  updatedById?: string | null;
  description?: string;
}

export interface AgentService {
  listForTeam(teamId: string, organizationId: string, roles?: AgentRole[]): Promise<AgentDto[]>;
  get(id: string, organizationId: string): Promise<AgentDto | null>;
  getIfExist(id: string, organizationId: string): Promise<AgentDto>;
  create(params: CreateAgentParams): Promise<AgentDto>;
  update(id: string, organizationId: string, params: UpdateAgentParams): Promise<AgentDto>;
  delete(id: string, organizationId: string): Promise<AgentDto>;
}

@Injectable()
export class DefaultAgentService implements AgentService {
  private readonly WALLET_ENCRYPTION_SECRET_KEY: string;

  constructor(
    @InjectAgentRepository() private readonly agentRepository: AgentRepository,
    @InjectAgentTeamRepository() private readonly agentTeamRepository: AgentTeamRepository,
    @InjectAgentEntityToDtoMapper() private agentEntityToDtoMapper: AgentEntityToDtoMapper,
    @InjectTransactionsManager() private transactionsManager: TransactionsManager,
    @InjectEventsService() private readonly eventsService: EventsService,
    @InjectEncryptionHelper() private readonly encryptionHelper: EncryptionHelper,
    @InjectAgentWalletGeneratorService() private readonly agentWalletGeneratorService: AgentWalletGeneratorService,
    private readonly configService: ConfigService,
  ) {
    this.WALLET_ENCRYPTION_SECRET_KEY = this.configService.getOrThrow<string>('WALLET_ENCRYPTION_SECRET_KEY');
  }

  public async listForTeam(teamId: string, organizationId: string, roles?: AgentRole[]) {
    const agentEntities = await this.agentRepository.findMany({
      teamId,
      organizationId,
      roles,
    });

    return this.agentEntityToDtoMapper.mapMany(agentEntities);
  }

  public async get(id: string, organizationId: string) {
    const agentEntity = await this.agentRepository.findByIdAndOrganizationId(id, organizationId);

    return agentEntity && this.agentEntityToDtoMapper.mapOne(agentEntity);
  }

  public async getIfExist(id: string, organizationId: string) {
    const agent = await this.get(id, organizationId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  public async create(params: CreateAgentParams) {
    const team = await this.agentTeamRepository.findByIdAndOrganizationId(params.teamId, params.organizationId);

    if (!team) {
      throw new UnprocessableEntityException('Provided Agent Team does not exist.');
    }

    const { privateKey, address } = await this.agentWalletGeneratorService.generateWallet();

    const encryptedPrivateKey = this.encryptionHelper.encrypt(privateKey, this.WALLET_ENCRYPTION_SECRET_KEY);

    return this.transactionsManager.useTransaction(async () => {
      const agentsWithSameRole = await this.agentRepository.exists({
        organizationId: params.organizationId,
        teamId: params.teamId,
        role: params.role,
      });

      if (agentsWithSameRole) {
        throw new UnprocessableEntityException('Agent with the same role already exists.');
      }

      const agentEntity = await this.agentRepository.createOne({
        name: params.name,
        role: params.role,
        team: params.teamId,
        model: params.model,
        modelApiKey: params.modelApiKey,
        config: {
          twitterAuthToken: params.twitterAuthToken,
          twitterUsername: params.twitterUsername,
          twitterPassword: params.twitterUsername,
          twitterEmail: params.twitterEmail,
        },
        imageUrl: '',
        description: params.description,
        organization: params.organizationId,
        createdBy: params.createdById,
        updatedBy: params.createdById,
        walletAddress: address,
        encryptedPrivateKey: encryptedPrivateKey,
      });

      const agent = this.agentEntityToDtoMapper.mapOne(agentEntity);

      await this.eventsService.create(generateAgentCreatedEvent(agent));

      return agent;
    });
  }

  public async update(id: string, organizationId: string, params: UpdateAgentParams) {
    return this.transactionsManager.useTransaction(async () => {
      const existingAgent = await this.getIfExist(id, organizationId);

      const updatedAgentEntity = await this.agentRepository.updateOneById(id, {
        ...(params.name ? { name: params.name } : {}),
        ...(params.model ? { model: params.model } : {}),
        ...(params.modelApiKey ? { modelApiKey: params.modelApiKey } : {}),
        ...(params.description !== undefined ? { description: params.description } : {}),
        config: {
          twitterAuthToken: params.twitterAuthToken ?? (existingAgent.config.twitterAuthToken as string | undefined),
          twitterUsername: params.twitterUsername ?? (existingAgent.config.twitterUsername as string | undefined),
          twitterPassword: params.twitterPassword ?? (existingAgent.config.twitterPassword as string | undefined),
          twitterEmail: params.twitterEmail ?? (existingAgent.config.twitterEmail as string | undefined),
        },
        updatedBy: params.updatedById,
      });

      if (!updatedAgentEntity) {
        throw new NotFoundException('Agent not found.');
      }

      const updatedAgent = this.agentEntityToDtoMapper.mapOne(updatedAgentEntity);

      await this.eventsService.create(generateAgentUpdatedEvent(existingAgent, updatedAgent));

      return updatedAgent;
    });
  }

  public async delete(id: string, organizationId: string) {
    return this.transactionsManager.useTransaction(async () => {
      const existingAgent = await this.getIfExist(id, organizationId);

      await this.agentRepository.deleteOneById(id);

      await this.eventsService.create(generateAgentDeletedEvent(existingAgent));

      return existingAgent;
    });
  }
}
