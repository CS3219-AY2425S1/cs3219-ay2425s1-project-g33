import { IsNotEmpty, IsString } from 'class-validator';

export class FindQuestionBySlugDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
