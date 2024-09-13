import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_user' })
  async getUser(@Payload() data: { userId: string }) {
    const { userId } = data;
    return this.appService.getUser(userId);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(
    @Payload() data: { userId: string, updateUserDto: UpdateUserDto },
  ) {
    const { userId, updateUserDto } = data;
    return this.appService.updateUser(userId, updateUserDto);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(data: CreateUserDto) {
    return this.appService.createUser(data);
  }
}