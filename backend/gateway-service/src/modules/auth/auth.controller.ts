import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto';
import { Token } from './interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() data: AuthDto): Promise<Token> {
    return this.authService.signUpLocal(data);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  logIn(@Body() data: AuthDto): Promise<Token> {
    return this.authService.logInLocal(data);
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
