import { IsString, IsIn, IsOptional, IsInt, Min, Max } from 'class-validator';

export class ExecuteCodeDto {
  @IsString()
  code: string;

  @IsString()
  @IsIn(['python3', 'c', 'cpp', 'java'])
  language: string;

  @IsString()
  @IsOptional()
  input?: string;

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  timeout?: number = 10; // Default timeout of 10 seconds
}
