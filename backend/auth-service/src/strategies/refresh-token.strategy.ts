import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { config } from 'src/configs';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  config.strategies.refreshTokenStrategy,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.local.jwtRefreshSecret,
      passReqToCallback: true, // Pass the token back to the callback
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer ', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
