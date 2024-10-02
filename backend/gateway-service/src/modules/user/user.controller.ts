import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto, UsersResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  /* @Get()
  @HttpCode(HttpStatus.OK)
  getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  } */

  // Update question
  @Patch('profile')
  async updateProfile(@GetCurrentUserId() id: string, @Body() dto: UpdateUserDto): Promise<UsersResponseDto> {
    const payload = { userId: id, updateUserDto: dto };
    const updatedUser = await firstValueFrom(this.userClient.send({ cmd: 'update-user-profile' }, payload));
    return plainToInstance(UsersResponseDto, updatedUser);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getUserDetails(@GetCurrentUserId() userId: string): Promise<UsersResponseDto> {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user-by-id' }, userId),
    );
    return plainToInstance(UsersResponseDto, user);
  }
}
