import { Exclude, Expose } from 'class-transformer';

export class UsersResponseDto {
  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  socialId: string;

  @Exclude()
  _id: string;
}
