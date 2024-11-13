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
  questionService: {
    port: parseInt(getEnvVar('QUESTION_SERVICE_PORT')),
    host: getEnvVar('QUESTION_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('QUESTION_SERVICE_TRANSPORT')] || Transport.TCP,
  },
  mongo: {
    connectionString: getEnvVar('MONGO_CONNECTION_STRING'),
  },
};
