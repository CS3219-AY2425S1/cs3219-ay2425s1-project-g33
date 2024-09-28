import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getUserByEmail(email: string) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user-by-email' }, email),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // async createUser(data: CreateUserDto) {
  //   const createdUser = await firstValueFrom(
  //     this.userClient.send({ cmd: 'create-user' }, data),
  //   );
  //   return createdUser;
  // }
}
