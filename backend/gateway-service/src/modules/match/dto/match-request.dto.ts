import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MatchRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @Type(() => String)
  selectedTopic: string[];

  @IsString()
  @IsNotEmpty()
  selectedDifficulty: string;
}
