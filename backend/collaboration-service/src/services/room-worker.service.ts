import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RoomWorkerService {
  constructor(private readonly redisService: RedisService) {}

  private CHECK_INTERVAL = 5000; // 5 seconds

  // Poll for matches at a regular interval
  async pollForRooms() {
    setInterval(async () => {
      const rooms = await this.redisService.listRooms()
      console.log('Current rooms', rooms)
    }, this.CHECK_INTERVAL);
  }
}
