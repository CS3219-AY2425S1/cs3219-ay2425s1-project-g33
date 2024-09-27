import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, hashedPassword } = data;

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new RpcException('User with this email already exists');
    }

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return savedUser;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();

    return user;
  }
}
