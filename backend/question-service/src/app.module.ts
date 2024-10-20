import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema } from './schema/question.schema';
import { config } from 'src/configs';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongo.connectionString),
    MongooseModule.forFeature([
      {
        name: 'Question',
        schema: QuestionSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
