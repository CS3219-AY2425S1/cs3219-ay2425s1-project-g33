import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern({ cmd: 'create_user' })
  handleUserCreated(data: CreateUserDto) {
    return this.appService.createUser(data);
  }
}
