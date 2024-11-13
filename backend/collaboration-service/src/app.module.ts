import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './configs';
import { CollabSessionSchema } from './schema/collab-session.schema';
import { CodeReviewService } from './code-review.service';
import { ClientsModule } from '@nestjs/microservices';
import { RedisService } from './services/redis.service';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongo.connectionString),
    MongooseModule.forFeature([
      {
        name: 'CollabSession',
        schema: CollabSessionSchema,
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
      {
        name: 'USER_SERVICE',
        transport: config.userService.transport,
        options: {
          host: config.userService.host,
          port: config.userService.port,
        },
        
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, CodeReviewService, RedisService],
})
export class AppModule {}
