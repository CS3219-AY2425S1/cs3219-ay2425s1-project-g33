import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
