import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto, ResetPasswordDto, ResetPasswordRequestDto } from './dto';
import { Token } from './interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RtAuthGuard } from '../../common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { config } from 'src/common/configs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @Post('local/signup')
  @ApiCreatedResponse({ description: 'User signup successfully' })
  @ApiBadRequestResponse({ description: 'User already exists' })
  async signUp(@Body() data: AuthDto): Promise<Token> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'local-sign-up' }, data),
    );
  }

  @Public()
  @Post('local/login')
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async logIn(@Body() data: AuthDto): Promise<Token> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'local-log-in' }, data),
    );
  }

  @Public()
  @Post('reset-password')
  @ApiCreatedResponse({
    description: 'Password reset request created successfully',
  })
  @ApiBadRequestResponse({ description: 'User not found' })
  async requestResetPassword(
    @Body() data: ResetPasswordRequestDto,
  ): Promise<boolean> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'request-reset-password' }, data),
    );
  }

  @Public()
  @Post('reset-password/verify')
  @ApiCreatedResponse({
    description: 'Password reset verified',
  })
  @ApiBadRequestResponse({ description: 'Invalid reset token' })
  async verifyResetToken(@Body('token') token: string): Promise<boolean> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'validate-password-reset-token' }, token),
    );
  }

  @Public()
  @Post('reset-password/confirm')
  @ApiCreatedResponse({
    description: 'Password reset successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid reset token' })
  async resetPassword(@Body() data: ResetPasswordDto): Promise<boolean> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'reset-password' }, data),
    );
  }

  // Strictly for SSR
  @Public()
  @Post('validate-token')
  @ApiOkResponse({ description: 'Token is valid' })
  @ApiBadRequestResponse({ description: 'Token is invalid' })
  async validateToken(
    @Headers('authorization') authHeader: string,
  ): Promise<boolean> {
    const [bearer, token] = authHeader?.split(' ');

    if (!(bearer === 'Bearer') || !token) {
      throw new BadRequestException('Token not provided');
    }

    return await firstValueFrom(
      this.authClient.send({ cmd: 'validate-access-token' }, token),
    );
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'User logged out successfully' })
  @ApiBadRequestResponse({ description: 'User not found' })
  async logOut(@GetCurrentUserId() userId: string): Promise<boolean> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'logout' }, { id: userId }),
    );
  }

  @Public()
  @Post('refresh')
  @UseGuards(RtAuthGuard)
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ description: 'Token refreshed successfully' })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
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
  @ApiOkResponse({ description: 'Google auth url generated successfully' })
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
  @ApiOkResponse({ description: 'Google auth callback successful' })
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    const { access_token: accessToken, refresh_token: refreshToken } =
      await firstValueFrom(
        this.authClient.send({ cmd: 'google-auth-redirect' }, { code }),
      );

    const redirectUrl = `${config.frontendUrl}/oauth?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(redirectUrl);
  }

  @Public()
  @Get('github')
  @ApiOkResponse({ description: 'Github auth url generated successfully' })
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
  @ApiOkResponse({ description: 'Github auth callback successful' })
  async githubAuthCallback(@Query('code') code: string, @Res() res: Response) {
    const { access_token: accessToken, refresh_token: refreshToken } =
      await firstValueFrom(
        this.authClient.send({ cmd: 'github-auth-redirect' }, { code }),
      );

    const redirectUrl = `${config.frontendUrl}/oauth?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(redirectUrl);
  }
}
