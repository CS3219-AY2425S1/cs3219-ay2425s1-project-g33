import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthDto, ValidateUserCredDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'local-sign-up' })
  signUpLocal(@Payload() data: AuthDto) {
    return this.appService.signUpLocal(data);
  }

  @MessagePattern({ cmd: 'validate-user-cred' })
  validateUser(@Payload() data: ValidateUserCredDto) {
    return this.appService.validateUserCred(data);
  }

  @MessagePattern({ cmd: 'google-auth-redirect' })
  async googleAuthRedirect(data: { code: string }) {
    const { code } = data;
    const response = await this.appService.validateGoogleUser(code);
    return { token: response.token, user: response.user };
  }

  @MessagePattern({ cmd: 'github-auth-redirect' })
  async githubAuthRedirect(data: { code: string }) {
    const { code } = data;
    const response = await this.appService.validateGithubUser(code);
    return { token: response.token, user: response.user };
  }
}
