import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from 'src/configs';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  config.strategies.accessTokenStrategy,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.local.jwtSecret,
    });
  }

  validate(payload: any) {
    return payload;
  }
}
