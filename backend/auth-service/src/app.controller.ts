import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IAuthGenerateJwt, IAuthJwtResponse } from './interfaces';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'generate-jwt' })
  async generateJwt(
    @Payload() data: IAuthGenerateJwt,
  ): Promise<IAuthJwtResponse> {
    let result: IAuthJwtResponse;

    if (data) {
      try {
        const createTokenResponse = await this.appService.generateJwt(data);
        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          token: createTokenResponse,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token_create_bad_request',
          token: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'token_create_bad_request',
        token: null,
      };
    }

    return result;
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
