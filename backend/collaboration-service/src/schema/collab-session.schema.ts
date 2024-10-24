import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'collab-sessions', versionKey: false, timestamps: true })
export class CollabSession extends Document {
  @Prop({ required: true, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' })
  difficultyPreference: string;

  @Prop({ required: true, default: [] })
  topicPreference: string[];

  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  userIds: string[];

  @Prop({ enum: ['active', 'completed'], default: 'active' })
  status: string;

  @Prop({ default: null })
  endedAt: Date;
}

export const CollabSessionSchema = SchemaFactory.createForClass(CollabSession);
