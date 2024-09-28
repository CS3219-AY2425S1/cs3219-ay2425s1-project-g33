import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthDto } from './dto';
import { Token } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  getGoogleOAuthUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    const state = 'secureRandomState';

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    return googleOAuthUrl;
  }

  async getGoogleAuthRedirect(code: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'google-auth-redirect' }, { code }),
    );
  }

  getGithubOAuthUrl(): string {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const scope = 'user:email';

    const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${scope}`;

    return githubLoginUrl;
  }

  async getGithubAuthRedirect(code: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'github-auth-redirect' }, { code }),
    );
  }
}
