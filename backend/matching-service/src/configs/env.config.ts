import { Transport } from '@nestjs/microservices';

export const config = {
  matchingService: {
    port: parseInt(process.env.MATCHING_SERVICE_PORT) || 3004,
    host: process.env.MATCHING_SERVICE_HOST || '0.0.0.0',
    transport: Transport[process.env.MATCHING_SERVICE_TRANSPORT] || Transport.TCP,
  },
  userService: {
    port: parseInt(process.env.USER_SERVICE_PORT) || 3001,
    host: process.env.USER_SERVICE_HOST || 'user-service',
    transport: Transport[process.env.USER_SERVICE_TRANSPORT] || Transport.TCP,
  },
  redis: {
    host: process.env.REDIS_HOST || 'backend-redis-1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
  mongo: {
    connectionString: process.env.MONGO_CONNECTION_STRING,
  },
};
