import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'google-auth-redirect' })
  async googleAuthRedirect(data: { code: string }) {
    const { code } = data;
    const tokens = await this.appService.exchangeGoogleCodeForTokens(code);

    const jwtToken = this.appService.generateJwt(tokens.user);

    return { token: jwtToken };
  }
}
