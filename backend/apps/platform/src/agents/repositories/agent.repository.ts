import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { AnyObject } from '@libs/types';
import { Agent } from '@apps/platform/agents/schemas';
import { AgentEntity, MongoAgentEntity } from '@apps/platform/agents/entities';
import { AgentModel, AgentRole } from '@apps/platform/agents/enums';

export interface IFindAgentTeamFilter {
  organizationId: string;
  role?: AgentRole;
  teamId?: string;
  roles?: AgentRole[];
}

export interface CreateAgentEntityParams {
  name: string;
  team: string;
  role: AgentRole;
  model: AgentModel;
  modelApiKey: string;
  config: AnyObject;
  organization: string;
  description?: string;
  imageUrl?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  walletAddress: string;
  encryptedPrivateKey: string;
}

export interface UpdateAgentEntityParams {
  name?: string;
  model?: AgentModel;
  modelApiKey?: string;
  config?: AnyObject;
  description?: string;
  imageUrl?: string;
  updatedBy?: string | null;
}

export interface AgentRepository {
  findMany(filter: IFindAgentTeamFilter): Promise<AgentEntity[]>;
  exists(filter: IFindAgentTeamFilter): Promise<boolean>;
  findByIdAndOrganizationId(id: string, organizationId: string): Promise<AgentEntity | null>;
  createOne(params: CreateAgentEntityParams): Promise<AgentEntity>;
  updateOneById(id: string, params: UpdateAgentEntityParams): Promise<AgentEntity | null>;
  deleteOneById(id: string): Promise<void>;
}

@Injectable()
export class MongoAgentRepository implements AgentRepository {
  public constructor(
    @InjectModel(Agent.name) private readonly agentModel: Model<Agent>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async exists(filter: IFindAgentTeamFilter) {
    const count = await this.agentModel.countDocuments(this.mapFilterToQuery(filter)).exec();

    return count > 0;
  }

  public async findMany(filter: IFindAgentTeamFilter) {
    const agents = await this.agentModel
      .find(this.mapFilterToQuery(filter), undefined, {
        lean: true,
        session: this.transactionsManager.getCurrentTransaction()?.getSession(),
      })
      .exec();

    return agents.map((team) => new MongoAgentEntity(team));
  }

  public async findByIdAndOrganizationId(id: string, organizationId: string) {
    const agent = await this.agentModel
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

    return agent ? new MongoAgentEntity(agent) : null;
  }

  public async createOne(params: CreateAgentEntityParams) {
    const [team] = await this.agentModel.create([params], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });

    return new MongoAgentEntity(team);
  }

  public async updateOneById(id: string, params: UpdateAgentEntityParams) {
    const agent = await this.agentModel
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...params,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return agent && new MongoAgentEntity(agent);
  }

  public async deleteOneById(id: string) {
    await this.agentModel
      .deleteOne(
        {
          _id: new ObjectId(id),
        },
        {
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();
  }

  private mapFilterToQuery(filter: IFindAgentTeamFilter) {
    return {
      ...(filter.teamId && { team: new ObjectId(filter.teamId) }),
      ...(filter.role && { role: filter.role }),
      ...(filter.roles && { role: { $in: filter.roles } }),
      organization: new ObjectId(filter.organizationId),
    };
  }
}
