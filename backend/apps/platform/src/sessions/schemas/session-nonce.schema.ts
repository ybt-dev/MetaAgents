import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type SessionNonceDocument = HydratedDocument<SessionNonce>;

@Schema({ timestamps: true, collection: 'session_nonces' })
export class SessionNonce {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  value: ObjectId;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;
}

export const SessionNonceSchema = SchemaFactory.createForClass(SessionNonce);

SessionNonceSchema.index({ value: 1 });

// Expire after 2 minutes
SessionNonceSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 2 });
