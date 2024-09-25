import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GenerateJwtDto, ValidateUserCredDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'generate-jwt' })
  generateJwt(@Payload() data: GenerateJwtDto) {
    return this.appService.generateJwt(data);
  }

  @MessagePattern({ cmd: 'validate-user-cred' })
  validateUser(@Payload() data: ValidateUserCredDto) {
    return this.appService.validateUserCred(data);
  }

  @MessagePattern({ cmd: 'google-auth-redirect' })
  async googleAuthRedirect(data: { code: string }) {
    const { code } = data;
    const tokens = await this.appService.exchangeGoogleCodeForTokens(code);

    const jwtToken = this.appService.generateJwt(tokens.user);
    return { token: jwtToken };
  }
}
