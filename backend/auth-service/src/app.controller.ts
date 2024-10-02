import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthDto,
  AuthIdDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dto';

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

  @MessagePattern({ cmd: 'request-reset-password' })
  requestResetPassword(@Payload() dto: ResetPasswordRequestDto) {
    return this.appService.generateResetPasswordRequest(dto);
  }

  @MessagePattern({ cmd: 'reset-password' })
  resetPassword(@Payload() dto: ResetPasswordDto) {
    return this.appService.resetPassword(dto);
  }

  @MessagePattern({ cmd: 'refresh-token' })
  refreshToken(@Payload() dto: RefreshTokenDto) {
    return this.appService.refreshToken(dto);
  }

  @MessagePattern({ cmd: 'validate-password-reset-token' })
  validatePasswordResetToken(token: string) {
    return this.appService.validatePasswordResetToken(token);
  }

  @MessagePattern({ cmd: 'validate-access-token' })
  validateToken(accessToken: string) {
    return this.appService.validateAccessToken(accessToken);
  }

  @MessagePattern({ cmd: 'validate-refresh-token' })
  validateRefreshToken(refreshToken: string) {
    return this.appService.validateRefreshToken(refreshToken);
  }

  @MessagePattern({ cmd: 'get-google-auth-url' })
  getGoogleOAuthUrl() {
    return this.appService.getGoogleOAuthUrl();
  }

  @MessagePattern({ cmd: 'google-auth-redirect' })
  async googleAuthRedirect(data: { code: string }) {
    const { code } = data;
    return this.appService.validateGoogleUser(code);
  }

  @MessagePattern({ cmd: 'get-github-auth-url' })
  getGithubOAuthUrl() {
    return this.appService.getGithubOAuthUrl();
  }

  @MessagePattern({ cmd: 'github-auth-redirect' })
  async githubAuthRedirect(data: { code: string }) {
    const { code } = data;
    return this.appService.validateGithubUser(code);
  }
}
