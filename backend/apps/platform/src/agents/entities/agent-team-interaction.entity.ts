import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AgentTeamInteraction } from '@apps/platform/agents/schemas';
import { AgentTeamInteractionStatus } from '@apps/platform/agents/enums';

export interface AgentTeamInteractionEntity {
  getId(): string;
  getTitle(): string;
  getRequestContent(): string;
  getTeamId(): string;
  getOrganizationId(): string;
  getStatus(): AgentTeamInteractionStatus;
  getCreatedById(): string | null | undefined;
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

  public getRequestContent() {
    return this.document.requestContent;
  }

  public getTeamId() {
    return this.document.team.toString();
  }

  public getOrganizationId() {
    return this.document.organization.toString();
  }

  public getStatus() {
    return this.document.status;
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
