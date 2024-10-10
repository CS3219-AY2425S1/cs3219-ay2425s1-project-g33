import { Transport } from '@nestjs/microservices';

export const config = {
  questionService: {
    port: parseInt(process.env.QUESTION_SERVICE_PORT) || 3002,
    host: process.env.USER_SERVICE_HOST || '0.0.0.0',
    transport: Transport[process.env.USER_SERVICE_TRANSPORT] || Transport.TCP,
  },
  mongo: {
    connectionString: process.env.MONGO_CONNECTION_STRING,
  },
};
