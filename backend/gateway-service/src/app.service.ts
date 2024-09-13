import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent } from './events/create-user.event';

@Injectable()
export class AppService {

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequest) {
    this.userClient.emit('user_created', new CreateUserEvent(createUserRequest.email));

  }
}
