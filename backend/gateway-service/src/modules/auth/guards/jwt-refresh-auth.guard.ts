import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export class JwtRefreshGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'validate-refresh-token' }, token),
      );
      request.user = user;
      return true;
    } catch (error) {
      return false;
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
