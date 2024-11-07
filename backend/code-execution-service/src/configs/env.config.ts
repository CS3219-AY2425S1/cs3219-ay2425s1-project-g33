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
  codeExecutionService: {
    port: parseInt(getEnvVar('CODE_EXECUTION_SERVICE_PORT')),
    host: getEnvVar('CODE_EXECUTION_SERVICE_HOST'),
    transport:
      Transport[getEnvVar('CODE_EXECUTION_SERVICE_TRANSPORT')] || Transport.TCP,
  },
};
