import { IsNotEmpty, IsString } from 'class-validator';

export class CodeReviewDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string

  @IsString()
  @IsNotEmpty()
  code: string;
}
