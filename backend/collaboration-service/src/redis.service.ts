import { Injectable } from "@nestjs/common";
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  private readonly pubSubClient: Redis;

  constructor() {
    this.redisClient = new Redis();  // Client for caching
    this.pubSubClient = new Redis(); // Separate client for Pub/Sub
  }

  // Store session in Redis
  async set(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value));
    // Publish the change to notify other instances
    this.pubSubClient.publish('sessionUpdate', key);
  }

  async get(key: string) {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    this.pubSubClient.subscribe(channel);
    this.pubSubClient.on('message', (channel, message) => {
      callback(message);  // Handle incoming messages
    });
  }
}
