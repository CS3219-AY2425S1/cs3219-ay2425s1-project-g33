import { IsNotEmpty, IsString } from 'class-validator';

export class MatchAcceptDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  matchId: string;
}
