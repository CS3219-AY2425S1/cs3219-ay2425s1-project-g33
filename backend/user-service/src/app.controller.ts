import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, GetUserByEmailDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @MessagePattern({ cmd: 'get-user-by-email' })
  async getUserByEmail(@Payload() data: { email: string }) {
    return this.appService.getUserByEmail(data.email);
  }
}
