import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Organization } from '@apps/platform/organizations/schemas';

export interface OrganizationEntity {
  getId(): string;
  getName(): string;
  getDescription(): string | undefined;
}

export class MongoOrganizationEntity implements OrganizationEntity {
  constructor(private readonly organizationDocument: FlattenMaps<Organization> & { _id: ObjectId }) {}

  public getId() {
    return this.organizationDocument._id.toString();
  }

  public getName() {
    return this.organizationDocument.name;
  }

  public getDescription() {
    return this.organizationDocument.description;
  }
}
