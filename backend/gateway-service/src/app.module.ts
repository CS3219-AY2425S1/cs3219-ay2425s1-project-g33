import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QuestionController } from './modules/question/question.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUESTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [],
})
export class AppModule {}
