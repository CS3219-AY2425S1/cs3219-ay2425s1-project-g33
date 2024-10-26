import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YjsGateway } from './yjs.gateway';
import { ClientsModule } from '@nestjs/microservices';
import { config } from './configs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COLLABORATION_SERVICE',
        transport: config.collaborationService.transport,
        options: {
          host: config.collaborationService.host,
          port: config.collaborationService.port,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, YjsGateway],
})
export class AppModule {}
