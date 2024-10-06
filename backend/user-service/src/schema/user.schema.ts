import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role, AccountProvider, Languages, Proficiency } from 'src/constants';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: false, default: '' })
  username: string;

  @Prop({ required: false, default: '' })
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false, default: null })
  password: string | null;

  @Prop({ required: true, enum: AccountProvider })
  provider: AccountProvider;

  @Prop({ required: false, default: null })
  socialId: string | null;

  @Prop({ required: false, default: '' })
  refreshToken: string;

  @Prop({ required: false, default: '' })
  profilePictureUrl?: string;

  @Prop({ required: false, enum: Proficiency, default: Proficiency.BEGINNER })
  proficiency: Proficiency;

  @Prop({ required: false, type: [String], enum: Languages })
  languages: Languages[];

  @Prop({ required: false, default: false })
  isOnboarded: boolean;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
