import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MatchRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @Type(() => String)
  selectedTopic: string[];

  @IsString()
  @IsNotEmpty()
  selectedDifficulty: string;
}
