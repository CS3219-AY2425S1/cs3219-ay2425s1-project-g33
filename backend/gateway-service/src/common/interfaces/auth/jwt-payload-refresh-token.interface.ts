import { JwtPayload } from './jwt-payload.interface';

export interface JwtPayloadRefreshToken extends JwtPayload {
  refreshToken: string;
}
