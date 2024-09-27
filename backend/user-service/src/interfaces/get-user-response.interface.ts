import { Proficiency, Languages } from '../schema/user.schema';

export interface GetUserResponse {
  username: string;
  displayName: string;
  email: string;
  profilePictureUrl?: string;
  proficiency: Proficiency;
  languages: Languages[];
}
