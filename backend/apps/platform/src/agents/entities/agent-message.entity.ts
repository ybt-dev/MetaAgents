import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AgentMessage } from '@apps/platform/agents/schemas';

export interface AgentMessageEntity {
  getId(): string;
  getOrganizationId(): string;
  getInteractionId(): string;
  getTeamId(): string;
  getSourceAgentId(): string;
  getTargetAgentId(): string;
  getContent(): string;
  getCreatedAt(): Date;
}

export class MongoAgentMessageEntity implements AgentMessageEntity {
  constructor(private readonly document: FlattenMaps<AgentMessage> & { _id: ObjectId }) {}

  public getId() {
    return this.document._id.toString();
  }

  public getOrganizationId() {
    return this.document.organization.toString();
  }

  public getInteractionId() {
    return this.document.interaction.toString();
  }

  public getTeamId() {
    return this.document.team.toString();
  }

  public getSourceAgentId() {
    return this.document.sourceAgent.toString();
  }

  public getTargetAgentId() {
    return this.document.targetAgent.toString();
  }

  public getContent() {
    return this.document.content;
  }

  public getCreatedAt() {
    return this.document.createdAt;
  }
}
