import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'This is the user service!';
  }

  createUser(createUserDto: CreateUserDto) {
    return this.userClient.send({ cmd: 'create_user' }, createUserDto);
  }
}
