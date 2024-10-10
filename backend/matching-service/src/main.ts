import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MatchWorkerService } from './match-worker.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3004,
      },
    },
  );
  const matchWorker = app.get(MatchWorkerService);
  matchWorker.pollForMatches(); 
  await app.listen();
  console.log('Matching Service is listening on port 3004');
}
bootstrap();
