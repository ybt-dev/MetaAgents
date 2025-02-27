import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { InteractionMessage } from '@apps/platform/agents/schemas';
import { InteractionMessageEntity, MongoInteractionMessageEntity } from '@apps/platform/agents/entities';
import { InteractionMessageActor } from '@apps/platform/agents/types';

export interface FindInteractionMessageEntitiesFilter {
  interactionId?: string;
  organizationId: string;
}

export interface CreateInteractionMessageEntityParams {
  id?: string;
  interaction: string;
  team: string;
  organization: string;
  content: string;
  sourceActor: InteractionMessageActor;
  repliedToMessageId?: string;
}

export interface InteractionMessageRepository {
  findMany(filter: FindInteractionMessageEntitiesFilter): Promise<InteractionMessageEntity[]>;
  createOne(params: CreateInteractionMessageEntityParams): Promise<InteractionMessageEntity>;
}

@Injectable()
export class MongoInteractionMessageRepository implements InteractionMessageRepository {
  public constructor(
    @InjectModel(InteractionMessage.name) private readonly interactionMessageModel: Model<InteractionMessage>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findMany(filter: FindInteractionMessageEntitiesFilter) {
    const messageDocuments = await this.interactionMessageModel
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
      return new MongoInteractionMessageEntity(messageDocument);
    });
  }

  public async createOne({ id, ...restParams }: CreateInteractionMessageEntityParams) {
    const [messageDocument] = await this.interactionMessageModel.create(
      [
        {
          _id: id ? new ObjectId(id) : new ObjectId(),
          ...restParams,
        },
      ],
      {
        session: this.transactionsManager.getCurrentTransaction()?.getSession(),
      },
    );

    return new MongoInteractionMessageEntity(messageDocument);
  }
}
