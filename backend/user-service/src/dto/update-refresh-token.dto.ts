import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
