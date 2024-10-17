import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  GoogleStrategy,
  GithubStrategy,
} from './strategies';
import { config } from './configs';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: config.strategies.accessTokenStrategy,
    }),
    HttpModule,
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: config.userService.transport,
        options: {
          host: config.userService.host,
          port: config.userService.port,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class AppModule {}
