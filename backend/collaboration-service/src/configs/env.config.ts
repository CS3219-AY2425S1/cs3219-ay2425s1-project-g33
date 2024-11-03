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
  mongo: {
    connectionString: getEnvVar('MONGO_CONNECTION_STRING'),
  },
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
  },
};
