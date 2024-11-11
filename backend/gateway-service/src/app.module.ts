import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { QuestionController } from './modules/question/question.controller';
import { CollaborationController } from './modules/collaboration/collaboration.controller';
import { CodeExecutionController } from './modules/code-execution/code-execution.controller';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard, RtAuthGuard } from './common/guards';
import { MatchGateway } from './modules/match/match.controller';
import { RedisMatchService } from './modules/match/redis.service';
import { config } from './common/configs';
import { HealthController } from './modules/health/health.controller';
import { CollaborationGateway } from './modules/collaboration/collaborationws.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: config.userService.transport,
        options: {
          host: config.userService.host,
          port: config.userService.port,
        },
      },
      {
        name: 'QUESTION_SERVICE',
        transport: config.questionService.transport,
        options: {
          host: config.questionService.host,
          port: config.questionService.port,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: config.authService.transport,
        options: {
          host: config.authService.host,
          port: config.authService.port,
        },
      },
      {
        name: 'MATCHING_SERVICE',
        transport: config.matchingService.transport,
        options: {
          host: config.matchingService.host,
          port: config.matchingService.port,
        },
      },
      {
        name: 'COLLABORATION_SERVICE',
        transport: config.collaborationService.transport,
        options: {
          host: config.collaborationService.host,
          port: config.collaborationService.port,
        },
      },
      {
        name: 'CODE_EXECUTION_SERVICE',
        transport: config.codeExecutionService.transport,
        options: {
          host: config.codeExecutionService.host,
          port: config.codeExecutionService.port,
        },
      },
    ]),
  ],
  controllers: [
    UserController,
    QuestionController,
    AuthController,
    CollaborationController,
    HealthController,
    CodeExecutionController,
  ],
  providers: [
    RtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: AtAuthGuard,
    },
    CollaborationGateway,
    MatchGateway,
    RedisMatchService,
  ],
})
export class AppModule {}
