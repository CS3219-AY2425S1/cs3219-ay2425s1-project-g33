import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
