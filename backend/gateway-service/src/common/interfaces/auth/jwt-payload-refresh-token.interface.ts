import { JwtPayload } from '../../../common/interfaces/auth/jwt-payload.interface';

export interface JwtPayloadRefreshToken extends JwtPayload {
  refreshToken: string;
}
