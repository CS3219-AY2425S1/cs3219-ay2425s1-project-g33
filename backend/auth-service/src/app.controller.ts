import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthDto, AuthIdDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'local-sign-up' })
  signUpLocal(@Payload() dto: AuthDto) {
    return this.appService.signUpLocal(dto);
  }

  @MessagePattern({ cmd: 'local-log-in' })
  logInLocal(@Payload() dto: AuthDto) {
    return this.appService.logInLocal(dto);
  }

  @MessagePattern({ cmd: 'logout' })
  logout(@Payload() dto: AuthIdDto) {
    return this.appService.logout(dto);
  }

  @MessagePattern({ cmd: 'refresh-token' })
  refreshToken(@Payload() dto: AuthIdDto) {
    return this.appService.refreshToken(dto);
  }

  @MessagePattern({ cmd: 'validate-token' })
  validateToken(token: string) {
    return this.appService.validateToken(token);
  }

  @MessagePattern({ cmd: 'validate-refresh-token' })
  validateRefreshToken(refreshToken: string) {
    return this.appService.validateRefreshToken(refreshToken);
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
