import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from './app.service';
import { RedisService } from './redis.service';

@Injectable()
export class SnapshotSchedulerService {
  constructor(private readonly redisService: RedisService, private readonly appService: AppService) {}

  // Cron job that runs every 10 seconds
  @Cron('*/10 * * * * *')
  async handleSnapshotTask() {
    console.log('Running snapshot task...');

    // Add logic here to process rooms and save snapshots to MongoDB
    // Example: Iterate through room IDs and take snapshots
    const rooms = await this.redisService.listRooms();
    for (const room of rooms) {
      await this.appService.saveDocumentSnapshot(room.roomId);
    }

    console.log('Snapshot task completed.');
  }
}
