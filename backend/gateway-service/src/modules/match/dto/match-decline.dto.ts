import { IsNotEmpty, IsString } from 'class-validator';

export class MatchDeclineDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  matchId: string;
}
