import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Languages, Proficiency } from 'src/schema/user.schema';
import { CreateUserDto } from './create-user.dto';

export class CreateUserProfileDto extends CreateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @IsOptional()
  @IsEnum(Proficiency)
  proficiency?: Proficiency;

  @IsArray()
  @IsOptional()
  @IsEnum(Languages, { each: true })
  languages: Languages[];
}
