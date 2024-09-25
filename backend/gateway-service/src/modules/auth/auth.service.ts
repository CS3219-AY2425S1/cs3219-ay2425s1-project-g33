import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LogInDto, SignUpDto, ValidateUserCredDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async signUp(data: SignUpDto) {
    try {
      const newUser = await firstValueFrom(
        this.userClient.send({ cmd: 'create-user' }, data),
      );

      const token = await firstValueFrom(
        this.authClient.send({ cmd: 'generate-jwt' }, newUser),
      );

      return {
        token: token,
        user: newUser,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logIn(data: LogInDto) {
    try {
      const user = await firstValueFrom(
        this.userClient.send(
          { cmd: 'get-user-by-email' },
          { email: data.email },
        ),
      );

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const payload: ValidateUserCredDto = {
        password: data.password,
        hashedPassword: user.password,
      };
      const isUserValid = await firstValueFrom(
        this.authClient.send({ cmd: 'validate-user-cred' }, payload),
      );
      if (!isUserValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      user.password = undefined;
      const token = await firstValueFrom(
        this.authClient.send({ cmd: 'generate-jwt' }, user),
      );

      return {
        token: token,
        user: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGoogleAuthRedirect(code: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'google-auth-redirect' }, { code }),
    );
  }

  getGoogleOAuthUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = 'email profile';
    const responseType = 'code';
    const state = 'secureRandomState';

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    return googleOAuthUrl;
  }
}
