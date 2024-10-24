import { RpcException, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const config = {
  frontendUrl: getEnvVar('FRONTEND_URL'),
  gatewayService: {
    port: parseInt(getEnvVar('GATEWAY_SERVICE_PORT')),
  },
  userService: {
    port: parseInt(getEnvVar('USER_SERVICE_PORT')),
    host: getEnvVar('USER_SERVICE_HOST'),
    transport: Transport[getEnvVar('USER_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  questionService: {
    port: parseInt(getEnvVar('QUESTION_SERVICE_PORT')),
    host: getEnvVar('QUESTION_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('QUESTION_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  authService: {
    port: parseInt(getEnvVar('AUTH_SERVICE_PORT')),
    host: getEnvVar('AUTH_SERVICE_HOST'),
    transport: Transport[getEnvVar('AUTH_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  matchingService: {
    port: parseInt(getEnvVar('MATCHING_SERVICE_PORT')),
    host: getEnvVar('MATCHING_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('MATCHING_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  collaborationService: {
    port: parseInt(getEnvVar('COLLABORATION_SERVICE_PORT')),
    host: getEnvVar('COLLABORATION_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('COLLABORATION_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  redis: {
    host: getEnvVar('REDIS_HOST'),
    port: parseInt(getEnvVar('REDIS_PORT')),
  },
};
