import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto, LogInDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('login')
  logIn(@Body() data: LogInDto) {
    return this.authService.logIn(data);
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
