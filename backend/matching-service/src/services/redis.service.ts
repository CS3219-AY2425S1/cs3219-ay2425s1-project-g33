import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { MatchRequestDto } from '../dto/match-request.dto';
import { MatchJob } from '../interfaces/match-job.interface';
import { config } from 'src/configs';

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

  // Add user to Redis pool
  async addUserToPool(data: MatchRequestDto): Promise<void> {
    const payload: MatchJob = {
      userId: data.userId,
      userProficiency: 'beginner',
      selectedTopic: data.selectedTopic,
      selectedDifficulty: data.selectedDifficulty,
      timestamp: Date.now(),
    };
    await this.redisPublisher.sadd('userPool', JSON.stringify(payload));
  }

  // Get users from Redis pool
  async getUsersFromPool(): Promise<MatchJob[]> {
    const users = await this.redisPublisher.smembers('userPool');
    return users.map((user) => JSON.parse(user));
  }

  // Remove users from Redis pool
  async removeUsersFromPool(userIds: string[]) {
    const users = await this.getUsersFromPool();

    // Find and remove users whose userId matches the provided userIds
    userIds.forEach(async (userId) => {
      const userToRemove = users.find((user) => user.userId === userId);
      if (userToRemove) {
        await this.redisPublisher.srem(
          'userPool',
          JSON.stringify(userToRemove),
        );
      }
    });
  }

  // Publish matched users to Redis Pub/Sub channel
  async publishMatchedUsers(matchedUserIds: string[]): Promise<void> {
    await this.redisPublisher.publish(
      'matchChannel',
      JSON.stringify(matchedUserIds),
    );
  }

  async publishTimedOutUsers(timedOutUserIds: string[]): Promise<void> {
    await this.redisPublisher.publish(
      'timeoutChannel',
      JSON.stringify(timedOutUserIds),
    );
  }
}
