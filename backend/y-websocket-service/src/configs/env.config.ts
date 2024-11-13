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
  mongo: {
    connectionString: getEnvVar('MONGO_CONNECTION_STRING'),
  },
  ywebsocket: {
    port: parseInt(getEnvVar('Y_WEBSOCKET_PORT')),
  },
  collaborationService: {
    port: parseInt(getEnvVar('COLLABORATION_SERVICE_PORT')),
    host: getEnvVar('COLLABORATION_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('COLLABORATION_SERVICE_TRANSPORT')] || Transport.TCP,
  },
};
