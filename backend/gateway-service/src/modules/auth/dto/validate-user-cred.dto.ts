import { IsNotEmpty } from 'class-validator';

export class ValidateUserCredDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  hashedPassword: string;
}
