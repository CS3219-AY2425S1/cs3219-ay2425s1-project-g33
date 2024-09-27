import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, GetUserByEmailDto } from './dto';
import { GetUserResponse } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @MessagePattern({ cmd: 'get-user-by-email' })
  async getUserByEmail(@Payload() email: string): Promise<GetUserResponse> {
    return this.appService.getUserByEmail(email);
  }
}
