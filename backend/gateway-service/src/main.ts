import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpResponseInterceptor } from 'src/common/interceptors';
import { config, setupSwagger } from 'src/common/configs';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // App Configuration
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*', // allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  setupSwagger(app);

  await app.listen(config.gatewayService.port);
  console.log(
    'Gateway Service is listening on port',
    config.gatewayService.port,
  );
}
bootstrap();
