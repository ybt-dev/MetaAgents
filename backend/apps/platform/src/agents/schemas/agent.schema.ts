import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AnyObject } from '@libs/types';
import { AgentModel, AgentRole } from '@apps/platform/agents/enums';

export type AgentDocument = HydratedDocument<Agent>;

@Schema({ timestamps: true, minimize: false })
export class Agent {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  role: AgentRole;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  organization: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  team: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  model: AgentModel;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  modelApiKey: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  config: AnyObject;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  walletAddress: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  encryptedPrivateKey: string;

  @Prop({ required: false, type: mongoose.Schema.Types.String })
  imageUrl?: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  createdBy: ObjectId;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  updatedBy: ObjectId;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

AgentSchema.index({ organization: 1, team: 1 });
AgentSchema.index({ organization: 1, team: 1, role: 1 }, { unique: true });
