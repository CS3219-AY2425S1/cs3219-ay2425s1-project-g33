import { IsNotEmpty, IsString } from 'class-validator';

export class GetCollabSessionDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
