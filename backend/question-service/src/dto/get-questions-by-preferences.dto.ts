import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetQuestionsByPreferencesDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty: string;

  @IsArray()
  @IsString({ each: true })
  topics: string[];
}
