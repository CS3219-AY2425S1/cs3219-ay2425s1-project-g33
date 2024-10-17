import { Exclude } from 'class-transformer';

export class UsersResponseDto {
  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  socialId: string;
}
