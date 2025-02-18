import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { AgentTeamRepository } from '@apps/platform/agents/repositories';
import { InjectAgentTeamRepository, InjectAgentTeamEntityToDtoMapper } from '@apps/platform/agents/decorators';
import { AgentTeamDto } from '@apps/platform/agents/dto';
import { AgentTeamEntityToDtoMapper } from '@apps/platform/agents/entities-mappers';

export interface CreateAgentTeamParams {
  organizationId: string;
  strategy: string;
  name: string;
  createdById: string;
  description?: string;
}

export interface UpdateAgentTeamParams {
  name?: string;
  description?: string;
  strategy?: string;
  updatedById?: string | null;
}

export interface AgentTeamService {
  get(id: string, organizationId: string): Promise<AgentTeamDto | null>;
  getIfExist(id: string, organizationId: string): Promise<AgentTeamDto>;
  list(organizationId: string): Promise<AgentTeamDto[]>;
  create(params: CreateAgentTeamParams): Promise<AgentTeamDto>;
  update(id: string, organizationId: string, params: UpdateAgentTeamParams): Promise<AgentTeamDto>;
}

@Injectable()
export class DefaultAgentTeamService implements AgentTeamService {
  constructor(
    @InjectAgentTeamRepository() private readonly agentTeamRepository: AgentTeamRepository,
    @InjectAgentTeamEntityToDtoMapper() private agentTeamEntityToDtoMapper: AgentTeamEntityToDtoMapper,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async get(id: string, organizationId: string) {
    const agentTeamEntity = await this.agentTeamRepository.findByIdAndOrganizationId(id, organizationId);

    return agentTeamEntity && this.agentTeamEntityToDtoMapper.mapOne(agentTeamEntity);
  }

  public async getIfExist(id: string, organizationId: string) {
    const agentTeam = await this.get(id, organizationId);

    if (!agentTeam) {
      throw new NotFoundException('Agent team not found');
    }

    return agentTeam;
  }

  public async list(organizationId: string) {
    const agentTeamEntities = await this.agentTeamRepository.findManyByOrganizationId(organizationId);

    return this.agentTeamEntityToDtoMapper.mapMany(agentTeamEntities);
  }

  public async update(id: string, organizationId: string, params: UpdateAgentTeamParams) {
    return this.transactionsManager.useTransaction(async () => {
      await this.getIfExist(id, organizationId);

      const agentTeamEntity = await this.agentTeamRepository.updateById(id, {
        name: params.name,
        strategy: params.strategy,
        description: params.description,
        updatedBy: params.updatedById,
      });

      if (!agentTeamEntity) {
        throw new NotFoundException('Agent team not found.');
      }

      return this.agentTeamEntityToDtoMapper.mapOne(agentTeamEntity);
    });
  }

  public async create(params: CreateAgentTeamParams) {
    const agentTeamEntity = await this.agentTeamRepository.createOne({
      name: params.name,
      strategy: params.strategy,
      description: params.description,
      organization: params.organizationId,
      createdBy: params.createdById,
      updatedBy: params.createdById,
    });

    return this.agentTeamEntityToDtoMapper.mapOne(agentTeamEntity);
  }
}
