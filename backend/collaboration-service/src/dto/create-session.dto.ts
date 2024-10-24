import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsArray()
  @IsNotEmpty()
  userIds: string[];

  @IsArray()
  @IsNotEmpty()
  topics: string[]
  
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}
