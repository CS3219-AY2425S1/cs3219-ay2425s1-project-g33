import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class TestCase {
  @IsString()
  input: string;

  @IsString()
  expectedOutput: string;
}

export class UpdateQuestionTestCasesDto {
  @IsString()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCase) // This ensures that each item in the array is treated as a TestCase
  testCases: TestCase[];
}
