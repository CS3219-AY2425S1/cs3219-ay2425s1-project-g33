import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { QuestionController } from './modules/question/question.controller';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard, RtAuthGuard } from './common/guards';
import { MatchGateway } from './modules/match/match.controller';
import { RedisService } from './modules/match/redis.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: 3001,
        },
      },
      {
        name: 'QUESTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'question-service',
          port: 3002,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service',
          port: 3003,
        },
      },
      {
        name: 'MATCHING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'matching-service',
          port: 3004,
        },
      }
    ]),
  ],
  controllers: [UserController, QuestionController, AuthController],
  providers: [
    RtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: AtAuthGuard,
    },
    MatchGateway,
    RedisService,
  ],
})
export class AppModule {}
