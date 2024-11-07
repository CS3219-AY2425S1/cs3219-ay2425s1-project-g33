import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class TestCase {
  @ApiProperty({
    example: 'Example Input',
  })
  @IsString()
  input: string;

  @ApiProperty({
    example: 'Expected Output',
  })
  @IsString()
  expectedOutput: string;
}

export class TestCasesDto {
  @ApiProperty({
    type: [TestCase],
    description: 'Array of test cases with input and expectedOutput',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCase)
  testCases: TestCase[];
}

export class UpdateQuestionTestCasesDto {
  @ApiProperty({
    description: 'ID of the question to update',
    example: '12345',
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: [TestCase],
    description: 'Array of test cases with input and expectedOutput',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCase)
  testCases: TestCase[];
}
