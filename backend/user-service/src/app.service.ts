import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { User } from './schema/user.schema';
import {
  CreateUserDto,
  CreateUserSocialsDto,
  DeleteRefreshTokenDto,
  UpdateRefreshTokenDto,
} from './dto';
import { AccountProvider } from './constants/account-provider.enum';

const SALT_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password } = data;

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new RpcException('User with this email already exists');
    }

    const newUser = new this.userModel({
      email,
      password: password,
      provider: AccountProvider.LOCAL
    });

    const savedUser = await newUser.save();

    return savedUser;
  }

  public async createUserSocials(data: CreateUserSocialsDto): Promise<User> {
    const { email, socialId, provider } = data;

    const newUser = new this.userModel({
      email,
      provider,
      password: null,
      socialId,
    });

    const savedUser = await newUser.save();

    return savedUser;
  }

  public async updateRefreshToken(
    data: UpdateRefreshTokenDto,
  ): Promise<boolean> {
    const { id, refreshToken } = data;

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new RpcException('User not found');
    }

    try {
      user.refreshToken = refreshToken;
      await user.save();
      return true;
    } catch (error) {
      throw new RpcException('Error updating refresh token');
    }
  }

  public async deleteRefreshToken(
    data: DeleteRefreshTokenDto,
  ): Promise<boolean> {
    const { id } = data;

    const user = await this.userModel
      .findOne({ _id: id, refreshToken: { $ne: null } })
      .exec();
    if (!user) {
      throw new RpcException('User is not logged in');
    }

    try {
      user.refreshToken = null;
      await user.save();
      return true;
    } catch (error) {
      throw new RpcException('Error deleting refresh token');
    }
  }
}
