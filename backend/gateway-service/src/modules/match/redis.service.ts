import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisSubscriber: Redis;

  constructor() {
    this.redisSubscriber = new Redis({
      host: 'backend-redis-1',
      port: 6379,
    });
  }

  // Subscribe to the Redis Pub/Sub channel for match events
  subscribeToMatchEvents(callback: (matchedUsers: any) => void): void {
    this.redisSubscriber.subscribe('matchChannel', (err, count) => {
      if (err) {
        console.error('Error subscribing to Redis channel:', err);
        return;
      }
      console.log('Subscribed to Redis channel matchChannel.');
    });

    // Listen for published messages on the channel
    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'matchChannel') {
        const matchedUsers = JSON.parse(message);
        callback(matchedUsers);
      }
    });
  }

  subscribeToTimeoutEvents(callback: (matchedUsers: any) => void): void {
    this.redisSubscriber.subscribe('timeoutChannel', (err, count) => {
      if (err) {
        console.error('Error subscribing to Redis channel:', err);
        return;
      }
      console.log('Subscribed to Redis channel timeoutChannel.');
    });

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'timeoutChannel') {
        const timedOutUsers = JSON.parse(message);
        callback(timedOutUsers);
      }
    });
  }
}
