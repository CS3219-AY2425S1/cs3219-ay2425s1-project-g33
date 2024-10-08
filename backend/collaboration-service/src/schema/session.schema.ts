import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Operation } from 'src/interfaces/operation.interface';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ default: '' })
  document: string; // This is the starting code (document)

  @Prop({ type: Array, default: [] })
  history: Operation[];

  @Prop({ default: 'active' })
  status: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
