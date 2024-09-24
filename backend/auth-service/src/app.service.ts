import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AppService {
  private oauthClient: OAuth2Client;
  constructor(private readonly jwtService: JwtService) {
    this.oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_CALLBACK_URL,
    });
  }
  getHello(): string {
    return 'Hello World!';
  }

  // Exchange the authorization code for tokens and user profile
  async exchangeGoogleCodeForTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      this.oauthClient.setCredentials(tokens);

      // Retrieve user profile
      const userInfo = await this.oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      return {
        tokens,
        user: userInfo.data,
      };
    } catch (error) {
      console.error('Error during token exchange:', error);
      throw new Error('Error exchanging authorization code for tokens');
    }
  }

  // Generate JWT for the authenticated user
  generateJwt(user: any): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
