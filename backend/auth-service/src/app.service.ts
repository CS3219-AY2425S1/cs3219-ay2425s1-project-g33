import * as bcrypt from 'bcryptjs';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { ClientProxy } from '@nestjs/microservices';
import { AuthDto, AuthIdDto, RefreshTokenDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
import { Token, TokenPayload } from './interfaces';
import { AccountProvider } from './constants/account-provider.enum';

const SALT_ROUNDS = 10;

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

  public async signUpLocal(dto: AuthDto): Promise<Token> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

      const newUser = await firstValueFrom(
        this.userClient.send(
          { cmd: 'create-user' },
          {
            email: dto.email,
            password: hashedPassword,
          },
        ),
      );

      // Bringing this method after receiving the response from the user service
      // As we want the user id/other user info to be involved in generating the tokens
      const userId = newUser._id.toString();
      const tokens = await this.generateTokens({
        id: userId,
        email: newUser.email,
      });
      await this.updateRefreshToken({
        id: userId,
        refreshToken: tokens.refresh_token,
      });

      return tokens;
    } catch (error) {
      throw new RpcException(`Error signing up user: ${error.message}`);
    }
  }

  public async logInLocal(dto: AuthDto): Promise<Token> {
    try {
      const user = await firstValueFrom(
        this.userClient.send(
          {
            cmd: 'get-user-by-email',
          },
          dto.email,
        ),
      );

      if (!user) {
        throw new RpcException('User not Found. Access Denied');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) {
        throw new RpcException('Invalid User Credentials. Access Denied');
      }

      const userId = user._id.toString();
      const tokens = await this.generateTokens({
        id: userId,
        email: user.email,
      });
      await this.updateRefreshToken({
        id: userId,
        refreshToken: tokens.refresh_token,
      });

      return tokens;
    } catch (error) {
      throw new RpcException(`Error logging in user: ${error.message}`);
    }
  }

  public async logout(dto: AuthIdDto): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.userClient.send({ cmd: 'delete-refresh-token' }, dto),
      );
      return response;
    } catch (error) {
      throw new RpcException(error.message || 'Error logging out user');
    }
  }

  public async refreshToken(dto: RefreshTokenDto): Promise<Token> {
    try {
      const { id, refreshToken } = dto;

      const user = await firstValueFrom(
        this.userClient.send({ cmd: 'get-user-by-id' }, id),
      );
      if (!user || !user.refreshToken) {
        throw new RpcException(
          'User does not have valid refresh token. Please sign in.',
        );
      }

      const refreshTokenMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!refreshTokenMatch) {
        throw new RpcException('Invalid Refresh Token');
      }

      const tokens = await this.generateTokens({
        id: id,
        email: user.email,
      });
      await this.updateRefreshToken({ id, refreshToken: tokens.refresh_token });

      return tokens;
    } catch (error) {
      throw new RpcException(`Error refreshing token: ${error.message}`);
    }
  }

  public async validateAccessToken(accessToken: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      return decoded;
    } catch (error) {
      throw new RpcException('Invalid access token');
    }
  }

  public async validateRefreshToken(refreshToken: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return decoded;
    } catch (error) {
      throw new RpcException('Invalid Refresh Token');
    }
  }

  private async updateRefreshToken(dto: RefreshTokenDto) {
    const { id, refreshToken } = dto;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    const response = await firstValueFrom(
      this.userClient.send(
        { cmd: 'update-refresh-token' },
        { id: id, refreshToken: hashedRefreshToken },
      ),
    );

    if (!response) {
      throw new RpcException('Error updating refresh token');
    }
  }

  // Could include other fields like roles in the future
  private async generateTokens(payload: TokenPayload): Promise<Token> {
    const { id, email } = payload;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m', // 15 minute
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d', // 1 week
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  getGoogleOAuthUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    const state = 'secureRandomState';

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    return googleOAuthUrl;
  }

  async validateGoogleUser(code: string): Promise<Token> {
    try {
      const tokens = await this.exchangeGoogleCodeForTokens(code);

      const googleUser = await this.getGoogleUserProfile(tokens);

      const existingUser = await firstValueFrom(
        this.userClient.send(
          {
            cmd: 'get-user-by-email',
          },
          googleUser.email,
        ),
      );

      let user = existingUser;

      // If user not found, initiate automatic sign up
      if (!existingUser) {
        user = await firstValueFrom(
          this.userClient.send(
            { cmd: 'create-user-socials' },
            {
              email: googleUser.email,
              socialId: googleUser.id,
              provider: AccountProvider.GOOGLE,
            },
          ),
        );
      }

      const jwtTokens = await this.generateTokens({
        id: user._id.toString(),
        email: user.email,
      });

      await this.updateRefreshToken({
        id: user._id.toString(),
        refreshToken: jwtTokens.refresh_token,
      });

      return jwtTokens;
    } catch (error) {
      throw new RpcException(
        `Unable to validate Google user: ${error.message}`,
      );
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
        `Unable to exchange Google authorization code for tokens: ${error.message}`,
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
      throw new RpcException(
        `Unable to retrieve Google user profile: ${error.message}`,
      );
    }
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

  async validateGithubUser(code: string): Promise<Token> {
    const accessToken = await this.exchangeGithubCodeForTokens(code);
    const githubUser = await this.getGithubUserProfile(accessToken);

    const existingUser = await firstValueFrom(
      this.userClient.send(
        {
          cmd: 'get-user-by-email',
        },
        githubUser.email,
      ),
    );

    let user = existingUser;

    // If user not found, initiate automatic sign up
    if (!existingUser) {
      user = await firstValueFrom(
        this.userClient.send(
          { cmd: 'create-user-socials' },
          {
            email: githubUser.email,
            socialId: githubUser.id,
            provider: AccountProvider.GITHUB,
          },
        ),
      );
    }

    const jwtTokens = await this.generateTokens({
      id: user._id.toString(),
      email: user.email,
    });

    await this.updateRefreshToken({
      id: user._id.toString(),
      refreshToken: jwtTokens.refresh_token,
    });

    return jwtTokens;
  }

  private async exchangeGithubCodeForTokens(code: string) {
    try {
      const params = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      };
      const headers = {
        Accept: 'application/json',
        'Accept-Encoding': 'application/json',
      };
      const response: AxiosResponse<any> = await axios.get(
        'https://github.com/login/oauth/access_token',
        {
          params,
          headers,
        },
      );
      return response?.data?.access_token;
    } catch (error) {
      throw new RpcException(
        `Unable to exchange Github authorization code for tokens: ${error.message}`,
      );
    }
  }

  private async getGithubUserProfile(accessToken: string) {
    try {
      // Get user profile
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      // Get user email
      const emailResponse: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return {
        ...response.data,
        email: emailResponse.data.find((email) => email.primary)?.email,
      }
    } catch (error) {
      throw new RpcException(
        `Unable to retrieve Github user profile: ${error.message}`,
      );
    }
  }
}
