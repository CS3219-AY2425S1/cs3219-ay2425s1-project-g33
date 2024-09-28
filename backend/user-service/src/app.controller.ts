import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  DeleteRefreshTokenDto,
  UpdateRefreshTokenDto,
} from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get-user-by-email' })
  async getUserByEmail(@Payload() email: string) {
    return this.appService.getUserByEmail(email);
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @MessagePattern({ cmd: 'update-refresh-token' })
  async updateRefreshtoken(@Payload() data: UpdateRefreshTokenDto) {
    return this.appService.updateRefreshToken(data);
  }

  @MessagePattern({ cmd: 'delete-refresh-token' })
  async deleteRefreshToken(@Payload() data: DeleteRefreshTokenDto) {
    return this.appService.deleteRefreshToken(data);
  }
}
