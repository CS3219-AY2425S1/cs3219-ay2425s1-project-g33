import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Proficiency {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum Languages {
  PYTHON = 'Python',
  JAVA = 'Java',
  CPLUSPLUS = 'C++',
}

@Schema()
export class User extends Document {
  @Prop({required: false, default: ''})
  username: string

  @Prop({required: false, default: ''})
  displayName: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: false, default: ''})
  profilePictureUrl?: string;

  @Prop({ required: false, enum: Proficiency, default: Proficiency.BEGINNER })
  proficiency: Proficiency;

  @Prop({ required: false, type: [String], enum: Languages })
  languages: Languages[];
}

export const UserSchema = SchemaFactory.createForClass(User);