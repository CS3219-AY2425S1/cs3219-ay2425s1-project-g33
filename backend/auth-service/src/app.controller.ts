import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GenerateJwtDto, ValidateUserCredDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    const response = await this.appService.validateGoogleUser(code);
    console.log(response);
    return { token: response.token, user: response.user };
  }

  @MessagePattern({ cmd: 'github-auth-redirect' })
  async githubAuthRedirect(data: { code: string }) {
    const { code } = data;
    const response = await this.appService.validateGithubUser(code);
    return { token: response.token, user: response.user };
  }
}
