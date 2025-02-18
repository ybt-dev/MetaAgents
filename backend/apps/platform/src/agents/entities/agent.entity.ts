import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AnyObject } from '@libs/types';
import { Agent } from '@apps/platform/agents/schemas';
import { AgentModel, AgentRole } from '@apps/platform/agents/enums';

export interface AgentEntity {
  getId(): string;
  getTeamId(): string;
  getOrganizationId(): string;
  getName(): string;
  getRole(): AgentRole;
  getModel(): AgentModel;
  getModelApiKey(): string;
  getConfig(): AnyObject;
  getDescription(): string | undefined;
  getImageUrl(): string | undefined;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
  getWalletAddress(): string;
  getEncryptedWalletPrivateKey(): string;
  getCreatedById(): string;
  getUpdatedById(): string;
}

export class MongoAgentEntity implements AgentEntity {
  constructor(private readonly document: FlattenMaps<Agent> & { _id: ObjectId }) {}

  public getId() {
    return this.document._id.toString();
  }

  public getRole() {
    return this.document.role;
  }

  public getTeamId() {
    return this.document.team.toString();
  }

  public getOrganizationId() {
    return this.document.organization.toString();
  }

  public getName() {
    return this.document.name;
  }

  public getModel() {
    return this.document.model;
  }

  public getModelApiKey() {
    return this.document.modelApiKey;
  }

  public getConfig() {
    return this.document.config;
  }

  public getDescription() {
    return this.document.description;
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

  public getWalletAddress() {
    return this.document.walletAddress;
  }

  public getEncryptedWalletPrivateKey() {
    return this.document.encryptedPrivateKey;
  }

  public getUpdatedById() {
    return this.document.updatedBy.toString();
  }
}
