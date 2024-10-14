import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { MatchRequestDto } from './dto/match-request.dto';
import { MatchJob } from './interfaces/match-job.interface';
import { config } from 'src/configs';
import { RpcException } from '@nestjs/microservices';
import { MatchResponse } from './interfaces';

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

  async addUserToPool(data: MatchRequestDto): Promise<MatchResponse> {
    try {
      const payload: MatchJob = {
        userId: data.userId,
        selectedTopic: data.selectedTopic,
        selectedDifficulty: data.selectedDifficulty,
        timestamp: Date.now(),
      };

      // Checks if the user is already in the pool
      const existingUser = await this.getUserFromPool(data.userId);
      if (existingUser) {
        return {
          success: false,
          message: 'User already in pool',
        };
      }

      await this.redisPublisher.sadd('userPool', JSON.stringify(payload));
      return {
        success: true,
        message: 'User added to pool successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add user to matching pool: ${error.message}`,
      };
    }
  }

  async removeUsersFromPool(userIds: string[]): Promise<MatchResponse> {
    try {
      const pipeline = this.redisPublisher.pipeline();

      // Check if the pool is empty
      const users = await this.getAllUsersFromPool();
      if (users.length === 0) {
        return {
          success: false,
          message: 'No users in the pool.',
        };
      }

      // Find users whose userId matches the provided userIds
      const usersToRemove = users.filter((user) =>
        userIds.includes(user.userId),
      );
      if (usersToRemove.length === 0) {
        return {
          success: false,
          message: 'No matching users found in the pool.',
        };
      }

      usersToRemove.forEach((user) => {
        pipeline.srem('userPool', JSON.stringify(user));
      });
      await pipeline.exec();

      return {
        success: true,
        message: `Removed ${usersToRemove.length} user(s) from the pool.`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to remove users from the pool: ${error.message}`,
      };
    }
  }

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

  async getUserFromPool(userId: string): Promise<boolean> {
    const user = await this.redisPublisher.hget('userPool', userId);
    return user ? JSON.parse(user) : null;
  }

  async getAllUsersFromPool(): Promise<MatchJob[]> {
    const users = await this.redisPublisher.smembers('userPool');
    return users.map((user) => JSON.parse(user));
  }
}
