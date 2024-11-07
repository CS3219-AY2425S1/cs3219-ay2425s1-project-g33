import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export class TestCaseDto {
  @IsString()
  input: string;

  @IsString()
  expectedOutput: string;
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  questionNumber: number;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases: TestCaseDto[];
}
