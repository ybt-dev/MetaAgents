import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InteractionMessageActor } from '@apps/platform/agents/types';

export type InteractionMessageDocument = HydratedDocument<InteractionMessage>;

@Schema({ timestamps: true, collection: 'interaction_messages' })
export class InteractionMessage {
  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  sourceActor: InteractionMessageActor;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  interaction: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  team: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  organization: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  content: string;

  @Prop({ required: false, type: mongoose.Schema.Types.String })
  repliedToMessageId?: string;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const InteractionMessageSchema = SchemaFactory.createForClass(InteractionMessage);

InteractionMessageSchema.index({ organization: 1, interaction: 1 });
