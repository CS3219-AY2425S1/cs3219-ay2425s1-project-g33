import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ClientsModule } from '@nestjs/microservices';
import { MatchWorkerService } from './services/match-worker.service';
import { RedisService } from './services/redis.service';
import { config } from 'src/configs';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: config.redis.port,
      },
    }),
    BullModule.registerQueue({
      name: 'match-queue',
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: config.userService.transport,
        options: {
          host: config.userService.host,
          port: config.userService.port,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'QUESTION_SERVICE',
        transport: config.questionService.transport,
        options: {
          host: config.questionService.host,
          port: config.questionService.port,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, MatchWorkerService, RedisService],
})
export class AppModule {}
