import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'match-history', versionKey: false, timestamps: true })
export class MatchHistory extends Document {
  @Prop({ required: false, default: '' })
  sessionId: string;

  @Prop({ required: true, default: [] })
  userIds: string[];

  @Prop({ required: true, default: [] })
  topicPreference: string[];

  @Prop({ required: true, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' })
  difficultyPreference: string;

  @Prop({ required: true, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
  status: string;
}

export const MatchHistorySchema = SchemaFactory.createForClass(MatchHistory);
