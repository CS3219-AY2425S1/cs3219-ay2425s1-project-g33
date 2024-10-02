import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto, UsersResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Get('current')
  @ApiOkResponse({ description: 'Get current user details successfully' })
  @HttpCode(HttpStatus.OK)
  async getUserDetails(
    @GetCurrentUserId() userId: string,
  ): Promise<UsersResponseDto> {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user-by-id' }, userId),
    );
    return plainToInstance(UsersResponseDto, user);
  }

  @Patch('profile')
  @ApiOkResponse({ description: 'Update user profile successfully' })
  async updateProfile(
    @GetCurrentUserId() id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UsersResponseDto> {
    const payload = { userId: id, updateUserDto: dto };
    const updatedUser = await firstValueFrom(
      this.userClient.send({ cmd: 'update-user-profile' }, payload),
    );
    return plainToInstance(UsersResponseDto, updatedUser);
  }
}
