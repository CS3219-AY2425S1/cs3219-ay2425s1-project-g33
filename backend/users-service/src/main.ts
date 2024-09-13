import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,  // Ensure the port matches the event producer
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('User Service is listening on port 3001');
}
bootstrap();
