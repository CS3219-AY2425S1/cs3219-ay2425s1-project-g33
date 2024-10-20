import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MatchWorkerService } from './match-worker.service';
import { config } from 'src/configs';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: config.matchingService.transport,
      options: {
        host: config.matchingService.host,
        port: config.matchingService.port,
      },
    },
  );
  const matchWorker = app.get(MatchWorkerService);
  matchWorker.pollForMatches();
  await app.listen();
  console.log(
    'Matching Service is listening on port',
    config.matchingService.port,
  );
}
bootstrap();
