import { Transport } from '@nestjs/microservices';
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
  collaborationService: {
    port: parseInt(getEnvVar('COLLABORATION_SERVICE_PORT')),
    host: getEnvVar('COLLABORATION_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('COLLABORATION_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  eventStore: {
    connection_string: getEnvVar('EVENT_STORE_CONNECTION_STRING'),
  },
  userService: {
    port: parseInt(getEnvVar('USER_SERVICE_PORT')),
    host: getEnvVar('USER_SERVICE_HOST'),
    transport: Transport[getEnvVar('USER_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  mongo: {
    connectionString: getEnvVar('MONGO_CONNECTION_STRING'),
  },
  redis: {
    host: getEnvVar('REDIS_HOST'),
    port: parseInt(getEnvVar('REDIS_PORT')),
  },
};
