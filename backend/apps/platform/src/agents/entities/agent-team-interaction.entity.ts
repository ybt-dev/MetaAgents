import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AgentTeamInteraction } from '@apps/platform/agents/schemas';

export interface AgentTeamInteractionEntity {
  getId(): string;
  getTitle(): string;
  getTeamId(): string;
  getOrganizationId(): string;
  getCreatedById(): string | null | undefined;
  getAdditionalDataRequested(): boolean | undefined;
  getRepliesQueue(): string[];
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
}

export class MongoAgentTeamInteractionEntity implements AgentTeamInteractionEntity {
  constructor(private readonly document: FlattenMaps<AgentTeamInteraction> & { _id: ObjectId }) {}

  public getId() {
    return this.document._id.toString();
  }

  public getTitle() {
    return this.document.title;
  }

  public getTeamId() {
    return this.document.team.toString();
  }

  public getOrganizationId() {
    return this.document.organization.toString();
  }

  public getAdditionalDataRequested() {
    return this.document.additionalDataRequested;
  }

  public getRepliesQueue() {
    return this.document.repliesQueue;
  }

  public getCreatedById() {
    return this.document.createdBy?.toString();
  }

  public getCreatedAt() {
    return this.document.createdAt;
  }

  public getUpdatedAt() {
    return this.document.updatedAt;
  }
}
