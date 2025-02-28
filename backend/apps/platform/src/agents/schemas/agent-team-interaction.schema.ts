import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export type AgentTeamInteractionDocument = HydratedDocument<AgentTeamInteraction>;

@Schema({ timestamps: true, minimize: false, collection: 'agent_team_interactions' })
export class AgentTeamInteraction {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  title: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  team: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  organization: ObjectId;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  createdBy?: ObjectId | null;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  lockedTill?: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const AgentTeamInteractionSchema = SchemaFactory.createForClass(AgentTeamInteraction);
