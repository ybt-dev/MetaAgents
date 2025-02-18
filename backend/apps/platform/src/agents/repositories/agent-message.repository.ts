import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { AgentMessage } from '@apps/platform/agents/schemas';
import { AgentMessageEntity, MongoAgentMessageEntity } from '@apps/platform/agents/entities';

export interface FindAgentMessageFilter {
  interactionId?: string;
  organizationId: string;
}

export interface AgentMessageRepository {
  findMany(filter: FindAgentMessageFilter): Promise<AgentMessageEntity[]>;
}

@Injectable()
export class MongoAgentMessageRepository implements AgentMessageRepository {
  public constructor(
    @InjectModel(AgentMessage.name) private readonly agentMessageModel: Model<AgentMessage>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findMany(filter: FindAgentMessageFilter) {
    const messageDocuments = await this.agentMessageModel
      .find(
        {
          ...(filter.interactionId ? { interaction: new ObjectId(filter.interactionId) } : {}),
          organization: new ObjectId(filter.organizationId),
        },
        undefined,
        {
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
          lean: true,
        },
      )
      .exec();

    return messageDocuments.map((messageDocument) => {
      return new MongoAgentMessageEntity(messageDocument);
    });
  }
}
