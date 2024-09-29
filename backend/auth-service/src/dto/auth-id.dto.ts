import { IsNotEmpty, IsString } from 'class-validator';

export class AuthIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
