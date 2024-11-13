import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as dotenv from 'dotenv';
import { config } from './configs';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(config.ywebsocket.port);
  console.log(
    'Y Websocket Service is listening on port',
    config.ywebsocket.port,
  );
}
bootstrap();
