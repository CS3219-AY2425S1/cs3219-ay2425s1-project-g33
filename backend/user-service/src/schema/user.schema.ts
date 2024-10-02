import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountProvider } from 'src/constants/account-provider.enum';
import { Languages } from 'src/constants/coding-languages.enum';
import { Proficiency } from 'src/constants/proficiency-level.enum';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
