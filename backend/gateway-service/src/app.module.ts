import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { UserService } from './modules/user/user.service';
import { QuestionService } from './modules/question/question.service';
import { QuestionController } from './modules/question/question.controller';
import { AuthService } from './modules/auth/auth.service';

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
    ]),
  ],
  controllers: [UserController, QuestionController, AuthController],
  providers: [UserService, QuestionService, AuthService],
})
export class AppModule {}
