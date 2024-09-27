import { Inject, Injectable, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getUserByEmail(email: string) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user-by-email' }, email),
    );
    console.log(user);
    return user;
  }
}
