import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type AgentMessageDocument = HydratedDocument<AgentMessage>;

@Schema({ timestamps: true, collection: 'agent_messages' })
export class AgentMessage {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  sourceAgent: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  targetAgent: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  interaction: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  team: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  organization: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  content: string;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const AgentMessageSchema = SchemaFactory.createForClass(AgentMessage);

AgentMessageSchema.index({ organization: 1, interaction: 1 });
