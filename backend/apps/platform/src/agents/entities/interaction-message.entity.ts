import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InteractionMessage } from '@apps/platform/agents/schemas';
import { InteractionMessageActor } from '@apps/platform/agents/types';

export interface InteractionMessageEntity {
  getId(): string;
  getOrganizationId(): string;
  getInteractionId(): string;
  getTeamId(): string;
  getSourceActor(): InteractionMessageActor;
  getContent(): string;
  getRepliedToMessageId(): string | undefined;
  getCreatedAt(): Date;
}

export class MongoInteractionMessageEntity implements InteractionMessageEntity {
  constructor(private readonly document: FlattenMaps<InteractionMessage> & { _id: ObjectId }) {}

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

  public getSourceActor() {
    return this.document.sourceActor;
  }

  public getContent() {
    return this.document.content;
  }

  public getRepliedToMessageId() {
    return this.document.repliedToMessageId;
  }

  public getCreatedAt() {
    return this.document.createdAt;
  }
}
