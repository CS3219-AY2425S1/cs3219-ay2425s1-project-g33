/* import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';  // Assuming you're using JwtService for token verification
import { JwtPayload } from '../interfaces/auth';  // Your existing JWT payload interface

export const GetCurrentUserId = createParamDecorator(
  async (_: undefined, context: ExecutionContext): Promise<string> => {
    const client = context.switchToWs().getClient();  // Access WebSocket client
    const token = client.handshake?.auth?.token;      // Extract JWT from the handshake auth

    if (!token) {
      throw new UnauthorizedException('No token found in handshake');
    }

    try {
      const jwtService = new JwtService({ secret: 'your-secret' });  // Use your JWT secret
      const decoded = jwtService.verify<JwtPayload>(token);          // Verify the token

      return decoded.sub;  // Return the user ID (sub) from the JWT payload
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  },
); */
