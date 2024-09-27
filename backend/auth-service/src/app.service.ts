import * as bcrypt from 'bcryptjs';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { ClientProxy } from '@nestjs/microservices';
import { GenerateJwtDto, ValidateUserCredDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private httpService: HttpService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    this.oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_CALLBACK_URL,
    });
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

  async validateGoogleUser(code: string): Promise<any> {
    try {
      const tokens = await this.exchangeGoogleCodeForTokens(code);

      const user = await this.getGoogleUserProfile(tokens);

      const payload = { email: user.email, sub: user.id };
      const jwtToken = this.jwtService.sign(payload);
      
      return { token: jwtToken, user };
    } catch (error) {
      throw new RpcException('Unable to validate Google user');
    }
  }

  private async exchangeGoogleCodeForTokens(
    code: string,
  ): Promise<Credentials> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      return tokens;
    } catch (error) {
      throw new RpcException(
        'Unable to exchange Google authorization code for tokens',
      );
    }
  }

  private async getGoogleUserProfile(tokens: Credentials): Promise<any> {
    try {
      this.oauthClient.setCredentials(tokens);

      const ticket = await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const userInfo = await this.oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        ...(typeof userInfo.data === 'object' ? userInfo.data : {}),
      };
    } catch (error) {
      throw new RpcException('Unable to retrieve Google user profile');
    }
  }

  async validateGithubUser(code: string) {
    const accessToken = await this.exchangeGithubCodeForTokens(code);
    const user = await this.getGithubUserProfile(accessToken);

    // Generate JWT token for the user
    const payload = { username: user.login, sub: user.id };
    const jwtToken = this.jwtService.sign(payload);
    return { token: jwtToken, user };
  }

  private async exchangeGithubCodeForTokens(code: string) {
    try {
      const response: AxiosResponse<any> = await axios.get(
        'https://github.com/login/oauth/access_token',
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.GITHUB_CALLBACK_URL,
          },
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'application/json',
          },
        },
      );
      return response?.data?.access_token;
    } catch (error) {
      throw new RpcException(
        'Unable to exchange Github authroization code for tokens',
      );
    }
  }

  private async getGithubUserProfile(accessToken: string) {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return response?.data;
    } catch (error) {
      throw new RpcException('Unable to retrieve Github user profile');
    }
  }
}
