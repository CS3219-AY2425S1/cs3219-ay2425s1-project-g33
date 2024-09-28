import { IsNotEmpty, IsString } from 'class-validator';

export class LogOutDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
