import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { AgentTeamInteraction } from '@apps/platform/agents/schemas';
import { AgentTeamInteractionEntity, MongoAgentTeamInteractionEntity } from '@apps/platform/agents/entities';
import { AgentTeamInteractionStatus } from '@apps/platform/agents/enums';

export interface FindAgentTeamInteractionFilter {
  teamId?: string;
  organizationId: string;
}

export interface CreateAgentTeamInteractionParams {
  title: string;
  requestContent: string;
  team: string;
  organization: string;
  status: AgentTeamInteractionStatus;
  createdBy?: string | null;
}

export interface AgentTeamInteractionRepository {
  findMany(filter: FindAgentTeamInteractionFilter): Promise<AgentTeamInteractionEntity[]>;
  findByIdAndOrganizationId(id: string, organizationId: string): Promise<AgentTeamInteractionEntity | null>;
  createOne(params: CreateAgentTeamInteractionParams): Promise<AgentTeamInteractionEntity>;
}

@Injectable()
export class MongoAgentTeamInteractionRepository implements AgentTeamInteractionRepository {
  constructor(
    @InjectModel(AgentTeamInteraction.name) private readonly model: Model<AgentTeamInteraction>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findMany(filter: FindAgentTeamInteractionFilter) {
    const agentTeamInteractionDocuments = await this.model
      .find(
        {
          ...(filter.teamId ? { team: new ObjectId(filter.teamId) } : {}),
          organization: new ObjectId(filter.organizationId),
        },
        undefined,
        {
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return agentTeamInteractionDocuments.map((agentTeamInteractionDocument) => {
      return new MongoAgentTeamInteractionEntity(agentTeamInteractionDocument);
    });
  }

  public async findByIdAndOrganizationId(id: string, organizationId: string) {
    const agentTeamInteractionDocument = await this.model
      .findOne(
        {
          _id: new ObjectId(id),
          organization: new ObjectId(organizationId),
        },
        undefined,
        {
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return agentTeamInteractionDocument && new MongoAgentTeamInteractionEntity(agentTeamInteractionDocument);
  }

  public async createOne(params: CreateAgentTeamInteractionParams): Promise<AgentTeamInteractionEntity> {
    const [agentTeamInteractionDocument] = await this.model.create([params], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });

    return new MongoAgentTeamInteractionEntity(agentTeamInteractionDocument);
  }
}
