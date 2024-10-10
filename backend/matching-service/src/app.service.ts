import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { MatchRequestDto } from './dto/match-request.dto';
import { RedisService } from './redis.service';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}

  // Add user to the Redis pool
  async requestMatch(data: MatchRequestDto): Promise<void> {
    await this.redisService.addUserToPool(data);
  }
}


