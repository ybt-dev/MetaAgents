import { Collection, Db, ObjectId } from 'mongodb';

export interface AgentTeamInteractionDocument {
  _id: ObjectId;
}

export interface AgentTeamInteractionsRepository {
  lockTeamInteraction(interactionId: string, lockedTill: Date): Promise<void>;
}

export class MongodbAgentTeamInteractionsRepository implements AgentTeamInteractionsRepository {
  private collection: Collection<AgentTeamInteractionDocument>;

  constructor(private database: Db) {
    this.collection = this.database.collection('agent_team_interactions');
  }

  public async lockTeamInteraction(interactionId: string, lockedTill: Date) {
    await this.collection.updateOne({ _id: new ObjectId(interactionId) }, { $set: { lockedTill } });
  }
}
