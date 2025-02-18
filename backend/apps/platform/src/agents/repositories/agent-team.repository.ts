import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { AgentTeam } from '@apps/platform/agents/schemas';
import { AgentTeamEntity, MongoAgentTeamEntity } from '@apps/platform/agents/entities';

interface CreateAgentTeamEntityParams {
  name: string;
  description: string;
  strategy: string;
  organization: string;
  imageUrl?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface UpdateAgentTeamEntityParams {
  name?: string;
  description?: string;
  strategy?: string;
  imageUrl?: string;
  updatedBy?: string | null;
}

export interface AgentTeamRepository {
  findByIdAndOrganizationId(id: string, organizationId: string): Promise<AgentTeamEntity | null>;
  findManyByOrganizationId(organizationId: string): Promise<AgentTeamEntity[]>;
  createOne(params: CreateAgentTeamEntityParams): Promise<AgentTeamEntity>;
  updateById(id: string, params: UpdateAgentTeamEntityParams): Promise<AgentTeamEntity | null>;
}

@Injectable()
export class MongoAgentTeamRepository implements AgentTeamRepository {
  public constructor(
    @InjectModel(AgentTeam.name) private readonly agentTeamModel: Model<AgentTeam>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findByIdAndOrganizationId(id: string, organizationId: string): Promise<AgentTeamEntity | null> {
    const agentTeam = await this.agentTeamModel
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

    return agentTeam ? new MongoAgentTeamEntity(agentTeam) : null;
  }

  public async findManyByOrganizationId(organizationId: string) {
    const teams = await this.agentTeamModel
      .find(
        {
          organization: new ObjectId(organizationId),
        },
        undefined,
        {
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return teams.map((team) => new MongoAgentTeamEntity(team));
  }

  public async createOne(params: CreateAgentTeamEntityParams) {
    const [team] = await this.agentTeamModel.create([params], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });

    return new MongoAgentTeamEntity(team);
  }

  public async updateById(id: string, params: UpdateAgentTeamEntityParams) {
    const team = await this.agentTeamModel
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: params,
        },
        {
          new: true,
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return team ? new MongoAgentTeamEntity(team) : null;
  }
}
