import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { config } from 'src/configs';
import { connect as connectToEventStore } from './event-store';
import * as dotenv from 'dotenv';
import { RoomWorkerService } from './room-worker.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: config.collaborationService.transport,
      options: {
        host: config.collaborationService.host,
        port: config.collaborationService.port,
      },
    },
  );
  await connectToEventStore();
  const roomWorker = app.get(RoomWorkerService);
  roomWorker.pollForRooms();
  await app.listen();
  console.log(
    'Collaboration Service is listening on port',
    config.collaborationService.port,
  );
}
bootstrap();
