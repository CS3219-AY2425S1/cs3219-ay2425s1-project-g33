import { Injectable } from '@nestjs/common';
import { MatchRequestDto } from '../dto';
import { RedisService } from './redis.service';

@Injectable()
export class MatchWorkerService {
  constructor(private readonly redisService: RedisService) {}

  // Poll for matches at a regular interval
  async pollForMatches() {
    setInterval(async () => {
      const users = await this.redisService.getUsersFromPool();
      const currentTime = Date.now();
      const timeout = 29000; // Slightly less than 30 seconds to account for processing time
      console.log('Polling', users);
      // Filter out users who have timed out
      const activeUsers = users.filter(user => currentTime - user.timestamp < timeout);

      if (activeUsers.length < users.length) {
        const timedOutUsers = users.filter(user => currentTime - user.timestamp >= timeout);
        await this.notifyGatewayTimeout(timedOutUsers.map(user => user.userId));
        await this.redisService.removeUsersFromPool(timedOutUsers.map(user => user.userId));
      }

      if (activeUsers.length >= 2) {
        const matches = this.rankUsers(activeUsers);
        const bestMatch = matches[0];

        // Notify the gateway via Redis Pub/Sub
        await this.notifyGateway([bestMatch.user1.userId, bestMatch.user2.userId]);

        // Remove the matched users from the Redis pool
        await this.redisService.removeUsersFromPool([bestMatch.user1.userId, bestMatch.user2.userId]);
      }
    }, 20000);
  }

  // Ranking logic for matches
  rankUsers(users: MatchRequestDto[]): { user1: MatchRequestDto, user2: MatchRequestDto, score: number }[] {
    const matches = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const score = this.calculateScore(users[i], users[j]);
        matches.push({ user1: users[i], user2: users[j], score });
      }
    }
    return matches.sort((a, b) => b.score - a.score)
  }

  private calculateScore(user1: MatchRequestDto, user2: MatchRequestDto): number {
    let score = 0;
    const matchingTopics = user1.selectedTopic.filter(topic => user2.selectedTopic.includes(topic));
    score += matchingTopics.length * 3;
    if (user1.selectedDifficulty === user2.selectedDifficulty) {
      score += 2;
    }
    return score;
  }

  // Notify the gateway service about the match via Redis Pub/Sub
  async notifyGateway(matchedUserIds: string[]) {
    await this.redisService.publishMatchedUsers(matchedUserIds);
  }

  async notifyGatewayTimeout(userIds: string[]) {
    await this.redisService.publishTimedOutUsers(userIds);
  }
}

