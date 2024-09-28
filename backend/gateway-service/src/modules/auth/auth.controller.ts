import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto';
import { AuthRequest, Token } from './interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtGuard, JwtRefreshGuard } from './guards';

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

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@Req() req: AuthRequest): Promise<boolean> {
    const user = req.user;
    return await firstValueFrom(
      this.authClient.send({ cmd: 'logout' }, { id: user.id }),
    );
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: AuthRequest): Promise<any> {
    const user = req.user;
    console.log('user', user);
    return await firstValueFrom(
      this.authClient.send({ cmd: 'refresh-token' }, { id: user.id }),
    );
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
