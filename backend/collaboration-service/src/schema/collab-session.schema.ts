import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'collab-sessions', versionKey: false, timestamps: true })
export class CollabSession extends Document {

  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  userIds: string[];

  @Prop({ enum: ['active', 'completed'], default: 'active' })
  status: string;

  @Prop({ default: null })
  roomAccessToken: string;

  @Prop({ default: null })
  endedAt: Date;
  
}

export const CollabSessionSchema = SchemaFactory.createForClass(CollabSession);
