import { IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Languages, Proficiency } from 'src/constants';

export class UpdateUserDto {

  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsEnum(Proficiency)
  @IsNotEmpty()
  proficiency: Proficiency;

  @IsEnum(Languages, { each: true })
  @IsNotEmpty()
  languages: Languages[];

  @IsOptional()
  @IsBoolean()
  isOnboarded: boolean;
}
