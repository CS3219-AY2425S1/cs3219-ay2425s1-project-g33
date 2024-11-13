import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        'Unauthorized access. No token provided.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'validate-access-token' }, token),
      );
      request.user = user;
      return true;
    } catch (error) {
      throw new HttpException(
        'Unauthorized access. Invalid token.',
        HttpStatus.UNAUTHORIZED,
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
