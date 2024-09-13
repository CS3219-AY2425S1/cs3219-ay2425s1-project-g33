
import {IsArray, IsEmail, IsEnum, IsOptional, IsString} from 'class-validator';
import { Languages, Proficiency } from 'src/schema/user.schema';
export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @IsOptional()
  @IsEnum(Proficiency)
  proficiency?: Proficiency;

  @IsArray()
  @IsEnum(Languages, { each: true })
  languages: Languages[];
}