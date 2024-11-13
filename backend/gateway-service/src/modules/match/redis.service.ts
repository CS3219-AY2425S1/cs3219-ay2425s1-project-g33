import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'src/common/configs';

@Injectable()
export class RedisMatchService {
  private redisSubscriber: Redis;

  constructor() {
    this.redisSubscriber = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
  }

  // Subscribe to the Redis Pub/Sub channel for match events
  subscribeToMatchEvents(callback: (matchedUsers: any) => void): void {
    this.redisSubscriber.subscribe('matchChannel', (err) => {
      if (err) {
        console.error('Error subscribing to Redis channel:', err);
        return;
      }
      console.log('Subscribed to Redis channel matchChannel.');
    });

    // Listen for published messages on the channel
    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'matchChannel') {
        const parsedMessage = JSON.parse(message);
        if (
          parsedMessage.matchId &&
          Array.isArray(parsedMessage.matchedUserIds)
        ) {
          callback({
            matchId: parsedMessage.matchId,
            matchedUserIds: parsedMessage.matchedUserIds,
          });
        }
      }
    });
  }

  subscribeToTimeoutEvents(callback: (matchedUsers: any) => void): void {
    this.redisSubscriber.subscribe('timeoutChannel', (err) => {
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
