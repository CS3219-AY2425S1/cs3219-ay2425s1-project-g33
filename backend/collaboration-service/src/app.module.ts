import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { RoomWorkerService } from './room-worker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './configs';
import { CollabSessionSchema } from './schema/collab-session.schema';
import { SnapshotSchedulerService } from './snapshot-scheduler.service';
import { CollabEventSnapshotSchema } from './schema/collab-event.schema';
import { OTEngineService } from './ot-engine.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongo.connectionString),
    MongooseModule.forFeature([
      {
        name: 'CollabSession',
        schema: CollabSessionSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'CollabEventSnapshot',
        schema: CollabEventSnapshotSchema,
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    RoomWorkerService,
    SnapshotSchedulerService,
    OTEngineService
  ],
})
export class AppModule {}
