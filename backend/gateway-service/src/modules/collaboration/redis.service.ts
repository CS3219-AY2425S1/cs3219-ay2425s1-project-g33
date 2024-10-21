import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'src/common/configs';


@Injectable()
export class RedisCollaborationService {
  private redisSubscriber: Redis;

  constructor() {
    this.redisSubscriber = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
  }

  // Subscribe to the Redis Pub/Sub channel for collaboration events
  subscribeToCollaborationEvents(callback: (matchedUsers: any) => void): void {
    this.redisSubscriber.subscribe('collaborationChannel', (err, count) => {
      if (err) {
        console.error('Error subscribing to Redis channel:', err);
        return;
      }
      console.log('Subscribed to Redis channel collaborationChannel.');
    });

    // Listen for published messages on the channel
    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'collaborationChannel') {
        const matchedUsers = JSON.parse(message);
        callback(matchedUsers);
      }
    });
  }
}
