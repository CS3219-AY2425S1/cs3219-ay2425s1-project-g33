import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadRefreshToken } from 'src/modules/auth/interfaces';

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadRefreshToken | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
      return request.user;
    }
    return request.user[data];
  },
);
