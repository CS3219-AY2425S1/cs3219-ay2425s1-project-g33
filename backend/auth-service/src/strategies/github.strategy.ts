import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { config } from 'src/configs';

@Injectable()
export class GithubStrategy extends PassportStrategy(
  Strategy,
  config.strategies.githubStrategy
) {
  constructor() {
    super({
      clientID: config.auth.github.clientId,
      clientSecret: config.auth.github.clientSecret,
      callbackURL: config.auth.github.callbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
