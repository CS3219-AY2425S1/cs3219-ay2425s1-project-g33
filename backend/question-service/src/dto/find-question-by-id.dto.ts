import { IsNotEmpty, IsString } from 'class-validator';

export class FindQuestionByIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
