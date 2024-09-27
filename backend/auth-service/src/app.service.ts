import * as bcrypt from 'bcryptjs';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ClientProxy } from '@nestjs/microservices';
import { GenerateJwtDto, ValidateUserCredDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    this.oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_CALLBACK_URL,
    });
  }

  getHello(): string {
    return 'This is the auth service!';
  }

  async generateJwt(user: GenerateJwtDto) {
    const payload = { ...user };
    return this.jwtService.sign(payload);
  }

  async validateUserCred(data: ValidateUserCredDto): Promise<boolean> {
    try {
      const { password, hashedPassword } = data;

      if (this.validatePassword(password, hashedPassword)) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RpcException('Error validating user credentials');
    }
  }

  private async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Exchange the authorization code for tokens and user profile
  async exchangeGoogleCodeForTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      this.oauthClient.setCredentials(tokens);

      // Verify the id token
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // Retrieve user profile
      const userInfo = await this.oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      return {
        tokens,
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          ...(typeof userInfo.data === 'object' ? userInfo.data : {}),
        },
      };
    } catch (error) {
      console.error('Error during token exchange:', error);
      throw new Error('Error exchanging authorization code for tokens');
    }
  }
}
