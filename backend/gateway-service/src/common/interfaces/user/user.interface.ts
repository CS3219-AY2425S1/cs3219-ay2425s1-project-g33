import {
  AccountProvider,
  Languages,
  Proficiency,
  Role,
} from 'src/common/constants';

export interface User {
  username: string;
  displayName: string;
  email: string;
  password: string | null;
  provider: AccountProvider;
  socialId: string | null;
  refreshToken: string;
  profilePictureUrl?: string;
  proficiency: Proficiency;
  languages: Languages[];
  isOnboarded: boolean;
  roles: Role[];
}
