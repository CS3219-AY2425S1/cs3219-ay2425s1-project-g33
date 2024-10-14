import { Injectable } from '@nestjs/common';
import { MatchRequestDto } from './dto/match-request.dto';
import { RedisService } from './redis.service';
import { MatchResponse } from './interfaces';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}

  // Add user to the Redis pool
  async requestMatch(data: MatchRequestDto): Promise<MatchResponse> {
    return this.redisService.addUserToPool(data);
  }

  // Remove user from the Redis pool
  async cancelMatch(userId: string): Promise<void> {
    await this.redisService.removeUsersFromPool([userId]);
  }
}
