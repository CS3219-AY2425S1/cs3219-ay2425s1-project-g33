import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from './configs';

const REDIS_CHANNEL = 'collaborationChannel';
const REDIS_ROOM_POOL_PREFIX = 'room-';

@Injectable()
export class RedisService {
  private redisPublisher: Redis;
  private redisSubscriber: Redis;

  constructor() {
    this.redisPublisher = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
    this.redisSubscriber = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
  }

  // Publish code changes to Redis
  async publishCodeChange(roomId: string, code: string): Promise<void> {
    const message = JSON.stringify({ roomId, code });
    await this.redisPublisher.publish(REDIS_CHANNEL, message);
  }

  // Add a user to a room
  async addUserToRoom(roomId: string, userId: string): Promise<void> {
    const roomKey = `${REDIS_ROOM_POOL_PREFIX}${roomId}`;
    await this.redisPublisher.sadd(roomKey, userId);
  }

  // Remove a user from a room
  async removeUserFromRoom(roomId: string, userId: string): Promise<void> {
    const roomKey = `${REDIS_ROOM_POOL_PREFIX}${roomId}`;
    await this.redisPublisher.srem(roomKey, userId);
  }

  // List all rooms and the users
  async listRooms(): Promise<{ roomId: string; users: string[] }[]> {
    const roomKeys = await this.redisPublisher.keys(`${REDIS_ROOM_POOL_PREFIX}*`);
    const rooms = [];
  
    for (const roomKey of roomKeys) {
      const users = await this.redisPublisher.smembers(roomKey);
      const roomId = roomKey.replace(REDIS_ROOM_POOL_PREFIX, '');
      rooms.push({ roomId, users });
    }
  
    return rooms;
  }

  // Subscribe to code change events from Redis
  subscribeToCodeChanges(callback: (room: string, code: string) => void) {
    this.redisSubscriber.subscribe(REDIS_CHANNEL, (err, count) => {
      if (err) {
        console.error('Failed to subscribe: ', err);
      } else {
        console.log(`Subscribed to ${REDIS_CHANNEL}. Currently subscribed to ${count} channels.`);
      }
    });

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === REDIS_CHANNEL) {
        const { room, code } = JSON.parse(message);
        callback(room, code);
      }
    });
  }
}
