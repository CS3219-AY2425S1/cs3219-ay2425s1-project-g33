import { Transport } from '@nestjs/microservices';

export const config = {
  gatewayService: {
    port: parseInt(process.env.GATEWAY_SERVICE_PORT) || 4000,
  },
  userService: {
    port: parseInt(process.env.USER_SERVICE_PORT) || 3001,
    host: process.env.USER_SERVICE_HOST || 'user-service',
    transport: Transport[process.env.USER_SERVICE_TRANSPORT] || Transport.TCP,
  },
  questionService: {
    port: parseInt(process.env.QUESTION_SERVICE_PORT) || 3002,
    host: process.env.QUESTION_SERVICE_HOST || 'question-service',
    transport:
      Transport[process.env.QUESTION_SERVICE_TRANSPORT] || Transport.TCP,
  },
  authService: {
    port: parseInt(process.env.AUTH_SERVICE_PORT) || 3003,
    host: process.env.AUTH_SERVICE_HOST || 'auth-service',
    transport: Transport[process.env.AUTH_SERVICE_TRANSPORT] || Transport.TCP,
  },
  matchingService: {
    port: parseInt(process.env.MATCHING_SERVICE_PORT) || 3004,
    host: process.env.MATCHING_SERVICE_HOST || 'matching-service',
    transport:
      Transport[process.env.MATCHING_SERVICE_TRANSPORT] || Transport.TCP,
  },
};
