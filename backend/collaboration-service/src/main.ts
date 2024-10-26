import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { config } from './configs';
import { ValidationPipe } from '@nestjs/common';

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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  console.log(
    'Collaboration Service is listening on port',
    config.collaborationService.port,
  );
}
bootstrap();
