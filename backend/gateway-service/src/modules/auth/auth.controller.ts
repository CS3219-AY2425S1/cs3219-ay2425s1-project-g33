import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto, LogOutDto } from './dto';
import { Token } from './interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: AuthDto): Promise<Token> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'local-sign-up' }, data),
    );
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() data: AuthDto): Promise<Token> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'local-log-in' }, data),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@Body() data: LogOutDto): Promise<boolean> {
    return await firstValueFrom(this.authClient.send({ cmd: 'logout' }, data));
  }

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const redirectUrl = this.authService.getGoogleOAuthUrl();
    res.redirect(redirectUrl);

    // In actuality, return url back to client
    // return {url: redirectUrl}
  }

  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string) {
    const response = await this.authService.getGoogleAuthRedirect(code);

    return { token: response.token, user: response.user };
  }

  @Get('github')
  async githubLogin(@Res() res: Response) {
    const redirectUrl = this.authService.getGithubOAuthUrl();
    res.redirect(redirectUrl);
    // In actuality, return url back to client
    // return {url: redirectUrl}
  }

  @Get('github/callback')
  async githubAuthCallback(@Query('code') code: string) {
    const response = await this.authService.getGithubAuthRedirect(code);

    return {
      token: response.token,
      user: response.user,
    };
  }
}
