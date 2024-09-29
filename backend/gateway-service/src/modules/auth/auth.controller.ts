import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto';
import { Token } from './interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { first, firstValueFrom } from 'rxjs';
import { RtAuthGuard } from '../../common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser, Public } from 'src/common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: AuthDto): Promise<Token> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'local-sign-up' }, data),
    );
  }

  @Public()
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() data: AuthDto): Promise<Token> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'local-log-in' }, data),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@GetCurrentUserId() userId: string): Promise<boolean> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'logout' }, { id: userId }),
    );
  }

  @Public()
  @UseGuards(RtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await firstValueFrom(
      this.authClient.send(
        { cmd: 'refresh-token' },
        { id: userId, refreshToken: refreshToken },
      ),
    );
  }

  @Public()
  @Get('google')
  async googleAuth(@Res() res: Response) {
    const redirectUrl = await firstValueFrom(
      this.authClient.send({ cmd: 'get-google-auth-url' }, {}),
    );
    res.redirect(redirectUrl);

    // In actuality, return url back to client
    // return {url: redirectUrl}
  }

  @Public()
  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'google-auth-redirect' }, { code }),
    );
  }

  @Public()
  @Get('github')
  async githubLogin(@Res() res: Response) {
    const redirectUrl = await firstValueFrom(
      this.authClient.send({ cmd: 'get-github-auth-url' }, {}),
    );
    res.redirect(redirectUrl);
    // In actuality, return url back to client
    // return {url: redirectUrl}
  }

  @Public()
  @Get('github/callback')
  async githubAuthCallback(@Query('code') code: string) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'github-auth-redirect' }, { code }),
    );
  }
}
