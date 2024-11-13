import { IsNotEmpty, IsString } from 'class-validator';

export class JoinCollabSessionRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
