import { Cursor as MongooseCursor, QueryOptions } from 'mongoose';
import { AbstractCursor, Cursor } from '@libs/database-tools/data';

export class MongodbCursor<Document, Entity> extends AbstractCursor<Entity> implements Cursor<Entity> {
  constructor(
    private mongooseCursor: MongooseCursor<Document, QueryOptions<Document>>,
    private mapper: (document: Document) => Entity,
  ) {
    super();
  }

  public async tryNext() {
    const document = await this.mongooseCursor.next();

    return document && this.mapper(document);
  }
}
