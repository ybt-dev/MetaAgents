import { ObjectId } from 'mongodb';

export interface IdGenerationHelper {
  generateId(): string;
}

export class ObjectIdGenerationHelper implements IdGenerationHelper {
  public generateId(): string {
    return new ObjectId().toString();
  }
}
