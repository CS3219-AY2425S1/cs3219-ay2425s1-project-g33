import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'collab-events', versionKey: false, timestamps: true })
export class CollabEventSnapshot extends Document {
  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  documentState: string;

  @Prop({ required: true })
  version: number;
}

export const CollabEventSnapshotSchema =
  SchemaFactory.createForClass(CollabEventSnapshot);
