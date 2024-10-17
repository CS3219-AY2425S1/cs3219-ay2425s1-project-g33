import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto, UsersResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/common/constants';
import { RolesGuard } from 'src/common/guards';

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
    const { _id, ...userDetails } = user;
    return plainToInstance(UsersResponseDto, { id: user._id, ...userDetails });
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

  @Patch(':id/assign-admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Assign admin role successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access. Only admin can access this resource.',
  })
  async assignAdminRole(@Param('id') id: string) {
    const updatedUser = await firstValueFrom(
      this.userClient.send({ cmd: 'assign-admin-role' }, id),
    );
    return plainToInstance(UsersResponseDto, updatedUser);
  }

  @Patch(':id/remove-admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Remove admin role successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access. Only admin can access this resource.',
  })
  async removeAssignRole(@Param('id') id: string) {
    const updatedUser = await firstValueFrom(
      this.userClient.send({ cmd: 'remove-admin-role' }, id),
    );
    return plainToInstance(UsersResponseDto, updatedUser);
  }
}
