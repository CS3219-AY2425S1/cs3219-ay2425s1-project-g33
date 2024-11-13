import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AccountProvider } from 'src/constants/account-provider.enum';

export class CreateUserSocialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  socialId: string;

  @IsEnum(AccountProvider)
  @IsNotEmpty()
  provider: AccountProvider;
}
