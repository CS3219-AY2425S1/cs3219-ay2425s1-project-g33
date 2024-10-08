import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { QuestionController } from './modules/question/question.controller';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard, RtAuthGuard } from './common/guards';
import { MatchGateway } from './modules/match/match.controller';
import { RedisService } from './modules/match/redis.service';
import { CollaborationGateway } from './modules/collaboration/collaboration.controller';

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
      },
      {
        name: 'COLLABORATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'collaboration-service',
          port: 3005,
        },
      },
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
    CollaborationGateway,
    RedisService,
  ],
})
export class AppModule {}
