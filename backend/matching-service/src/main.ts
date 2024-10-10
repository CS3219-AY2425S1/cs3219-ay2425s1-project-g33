import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MatchWorkerService } from './services/match-worker.service';
import { config } from 'src/configs';

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
