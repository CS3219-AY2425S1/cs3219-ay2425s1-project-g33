import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { config } from './configs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: config.authService.transport,
      options: {
        host: config.authService.host,
        port: config.authService.port,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('Auth Service is listening on port', config.authService.port);
}
bootstrap();
