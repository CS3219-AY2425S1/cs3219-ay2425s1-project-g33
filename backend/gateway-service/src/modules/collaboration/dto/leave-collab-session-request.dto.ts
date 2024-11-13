import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveCollabSessionRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
