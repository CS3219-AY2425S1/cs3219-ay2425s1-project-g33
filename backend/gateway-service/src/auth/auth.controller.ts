import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const redirectUrl = await this.authService.getGoogleOAuthUrl();
    res.redirect(redirectUrl);
  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    const response = await this.authService.getGoogleAuthRedirect(code);

    const jwtToken = response.token;
    // Redirect the user with the JWT token (or you can set a cookie here)
    return { token: jwtToken };
  }
}
