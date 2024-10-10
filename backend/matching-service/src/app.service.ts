import { Injectable } from '@nestjs/common';
import { MatchRequestDto } from './dto/match-request.dto';
import { RedisService } from './services/redis.service';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}

  // Add user to the Redis pool
  async requestMatch(data: MatchRequestDto): Promise<void> {
    await this.redisService.addUserToPool(data);
  }
}


