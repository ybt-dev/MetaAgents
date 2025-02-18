import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AgentTeam } from '@apps/platform/agents/schemas';

export interface AgentTeamEntity {
  getId(): string;
  getOrganizationId(): string;
  getName(): string;
  getDescription(): string;
  getStrategy(): string;
  getImageUrl(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
  getCreatedById(): string;
  getUpdatedById(): string;
}

export class MongoAgentTeamEntity implements AgentTeamEntity {
  constructor(private readonly document: FlattenMaps<AgentTeam> & { _id: ObjectId }) {}

  public getId() {
    return this.document._id.toString();
  }

  public getOrganizationId() {
    return this.document.organization.toString();
  }

  public getName() {
    return this.document.name;
  }

  public getDescription() {
    return this.document.description;
  }

  public getStrategy() {
    return this.document.strategy;
  }

  public getImageUrl() {
    return this.document.imageUrl || '';
  }

  public getCreatedAt() {
    return this.document.createdAt;
  }

  public getUpdatedAt() {
    return this.document.updatedAt;
  }

  public getCreatedById() {
    return this.document.createdBy.toString();
  }

  public getUpdatedById() {
    return this.document.updatedBy.toString();
  }
}
