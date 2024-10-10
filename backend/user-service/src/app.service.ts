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
  UpdateUserPasswordDto,
} from './dto';
import { AccountProvider } from './constants/account-provider.enum';
import { UpdateUserPayload } from './payload/update-user.payload';
import { Role } from './constants';

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
      provider: AccountProvider.LOCAL,
      roles: [Role.USER],
    });

    const savedUser = await newUser.save();

    return savedUser;
  }

  public async updateUserPassword(
    data: UpdateUserPasswordDto,
  ): Promise<boolean> {
    const { id, password } = data;

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new RpcException('User not found');
    }

    try {
      user.password = password;
      await user.save();
      return true;
    } catch (error) {
      throw new RpcException(`Error updating user password: ${error.message}`);
    }
  }

  public async updateUserProfile(data: UpdateUserPayload): Promise<User> {
    const { userId, updateUserDto } = data;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new RpcException('User not found');
    }

    const { username, displayName, languages, proficiency, isOnboarded } =
      updateUserDto;

    if (username && username !== user.username) {
      const existingUser = await this.userModel.findOne({ username }).exec();
      if (existingUser) {
        throw new RpcException('Username is already taken');
      }
      user.username = username;
    }

    if (displayName) {
      user.displayName = displayName;
    }

    if (languages) {
      user.languages = languages;
    }

    if (proficiency) {
      user.proficiency = proficiency;
    }

    if (!user.isOnboarded && isOnboarded) {
      user.isOnboarded = isOnboarded;
    }

    try {
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      throw new RpcException(`Error updating user profile: ${error.message}`);
    }
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

  public async assignAdminRole(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new RpcException('User not found');
    }

    if (user.roles.includes(Role.ADMIN)) {
      throw new RpcException('User already has admin role');
    }

    user.roles.push(Role.ADMIN);

    try {
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new RpcException(`Error assigning admin role: ${error.message}`);
    }
  }

  public async removeAdminRole(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new RpcException('User not found');
    }

    if (!user.roles.includes(Role.ADMIN)) {
      throw new RpcException('User does not have admin role');
    }

    user.roles = user.roles.filter((role) => role !== Role.ADMIN);

    try {
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new RpcException(`Error assigning admin role: ${error.message}`);
    }
  }
}
