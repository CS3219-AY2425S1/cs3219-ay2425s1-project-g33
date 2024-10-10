import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'src/configs'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: config.userService.transport,
    options: {
      host: config.userService.host,
      port: config.userService.port,  // Ensure the port matches the event producer
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('User Service is listening on port', config.userService.port);
}
bootstrap();
