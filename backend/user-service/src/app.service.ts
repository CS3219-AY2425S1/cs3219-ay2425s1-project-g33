import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { IUser } from './interfaces';
import * as bcrypt from 'bcryptjs';
import { GetUserByEmailDto } from './dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async createUser(data: IUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const userModel = new this.userModel({
      ...data,
      password: hashedPassword,
    });

    const createdUser = await userModel.save();
    const userObj = createdUser.toObject();
    delete userObj.password;

    return userObj;
  }

  public async getUserByEmail(params: GetUserByEmailDto): Promise<IUser> {
    const email = params.email;
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  public async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
