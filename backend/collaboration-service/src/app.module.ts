import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schema/session.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([
      {
        name: 'Session',
        schema: SessionSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
