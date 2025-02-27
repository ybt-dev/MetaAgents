import { Collection, Db, ObjectId } from 'mongodb';

export interface AgentTeamInteractionDocument {
  _id: ObjectId;
}

export interface AgentTeamInteractionsRepository {
  addMessageIdToRepliesQueue(messageId: string, interactionId: string): Promise<void>;
}

export class MongodbAgentTeamInteractionsRepository implements AgentTeamInteractionsRepository {
  private collection: Collection<AgentTeamInteractionDocument>;

  constructor(private database: Db) {
    this.collection = this.database.collection('agent_team_interactions');
  }

  public async addMessageIdToRepliesQueue(messageId: string, interactionId: string) {
    await this.collection.updateOne({ _id: new ObjectId(interactionId) }, { $push: { repliesQueue: messageId } });
  }
}
