import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({required: true})
  username: string

  @Prop({required:true})
  displayName: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: false, default: ''})
  profilePictureUrl?: string;

  @Prop({ required: true, enum: Proficiency, default: Proficiency.BEGINNER })
  proficiency: Proficiency;

  @Prop({ required: true, type: [String], enum: Languages })
  languages: Languages[];


}

export const UserSchema = SchemaFactory.createForClass(User);