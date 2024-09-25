import { Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserByEmailDto, ValidateUserDto } from './dto';
import { IUser, IUserResponse } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() userParams: IUser): Promise<IUserResponse> {
    let result: IUserResponse;

    if (userParams) {
      const usersWithEmail = await this.appService.getUserByEmail({
        email: userParams.email,
      });

      if (usersWithEmail) {
        result = {
          status: HttpStatus.CONFLICT,
          message: 'user_create_conflict',
          user: null,
          errors: {
            email: {
              message: 'User with this email already exists',
              path: 'email',
            },
          },
        };
      } else {
        try {
          const createdUser = await this.appService.createUser(userParams);

          result = {
            status: HttpStatus.CREATED,
            message: 'user_create_success',
            user: createdUser,
            errors: null,
          };
        } catch (e) {
          result = {
            status: HttpStatus.PRECONDITION_FAILED,
            message: 'user_create_precondition_failed',
            user: null,
            errors: e.errors,
          };
        }
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_create_bad_request',
        user: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern({ cmd: 'get-user-by-email' })
  async getUserByEmail(
    @Payload() data: GetUserByEmailDto,
  ): Promise<IUserResponse> {
    let result: IUserResponse;

    if (data && data.email) {
      const user = await this.appService.getUserByEmail(data);

      if (user) {
        result = {
          status: HttpStatus.OK,
          message: 'user_found',
          user: user,
          errors: null,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
          user: null,
          errors: {
            email: {
              message: 'User not found',
            },
          },
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_info_not_provided',
        user: null,
        errors: {
          email: {
            message: 'User email not provided correctly',
          },
        },
      };
    }

    return result;
  }

  @MessagePattern({ cmd: 'validate-user' })
  async validateUser(@Payload() data: ValidateUserDto): Promise<IUserResponse> {
    let result: IUserResponse;

    if (data && data.email && data.password) {
      const user = await this.appService.getUserByEmail(data);

      if (user) {
        if (
          await this.appService.comparePasswords(data.password, user.password)
        ) {
          const userObj = user.toObject();
          delete userObj.password;

          result = {
            status: HttpStatus.OK,
            message: 'user_validated',
            user: userObj,
            errors: null,
          };
        } else {
          result = {
            status: HttpStatus.UNAUTHORIZED,
            message: 'user_invalid_password',
            user: null,
            errors: {
              password: {
                message: 'Invalid password',
              },
            },
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
          user: null,
          errors: {
            email: {
              message: 'User not found',
            },
          },
        };
      }
    }

    return result;
  }
}
