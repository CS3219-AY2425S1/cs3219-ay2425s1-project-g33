import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  CreateUserSocialsDto,
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

  @MessagePattern({ cmd: 'get-user-by-id' })
  async getUserById(@Payload() id: string) {
    return this.appService.getUserById(id);
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.appService.createUser(data);
  }

  @MessagePattern({ cmd: "create-user-socials"})
  async createUserSocials(@Payload() data: CreateUserSocialsDto) {
    return this.appService.createUserSocials(data);
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
