import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MatchWorkerService } from './match-worker.service';
import { RedisService } from './redis.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'backend-redis-1',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'match-queue',
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MatchWorkerService,
    RedisService,
  ],
})
export class AppModule {}
