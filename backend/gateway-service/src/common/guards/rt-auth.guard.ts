import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        'Unauthorized. No token provided.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'validate-refresh-token' }, token),
      );
      if (!user) {
        throw new HttpException(
          'Unauthorized. Invalid token.',
          HttpStatus.FORBIDDEN,
        );
      }

      request.user = { ...user, refreshToken: token };
      return true;
    } catch (error) {
      throw new HttpException(
        'Unauthorized. Invalid token.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const header = request.headers.authorization;
    if (!header) {
      return null;
    }

    const [bearer, token] = header.split(' ');
    return bearer === 'Bearer' && token ? token : null;
  }
}
