import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';

// Difficulty Enum
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

// Test Result DTO (formerly TestCaseDto)
export class TestResultDto {
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @ValidateNested()
  data: TestResultDataDto;
}

export class TestResultDataDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @ValidateNested()
  result: ResultDto;
}

class ResultDto {
  @IsString()
  stdout: string;

  @IsString()
  stderr: string;

  @IsNumber()
  executionTime: number;
}
