import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from '@apps/platform//users/schemas';

export interface UserEntity {
  getId(): string;
  getOrganizationId(): string;
  getAddress(): string;
  getFirstName(): string;
  getLastName(): string;
}

export class MongoUserEntity implements UserEntity {
  constructor(private readonly userDocument: FlattenMaps<User> & { _id: ObjectId }) {}

  public getId() {
    return this.userDocument._id.toString();
  }

  public getOrganizationId() {
    return this.userDocument.organization.toString();
  }

  public getFirstName() {
    return this.userDocument.firstName;
  }

  public getLastName() {
    return this.userDocument.lastName;
  }

  public getAddress() {
    return this.userDocument.address;
  }
}
