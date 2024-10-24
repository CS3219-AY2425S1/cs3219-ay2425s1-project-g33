import { Injectable } from '@nestjs/common';
import { MatchRequestDto } from './dto/match-request.dto';
import { RedisService } from './services/redis.service';
import { MatchDetails, MatchResponse } from './interfaces';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}

  // Add user to the Redis pool
  async requestMatch(data: MatchRequestDto): Promise<MatchResponse> {
    return this.redisService.addUserToPool(data);
  }

  // Remove user from the Redis pool
  async cancelMatch(userId: string): Promise<MatchResponse> {
    return this.redisService.removeUsersFromPool([userId]);
  }

  // Get match details
  async getMatchDetails(matchId: string): Promise<MatchDetails> {
    return this.redisService.getMatch(matchId);
  }
}
