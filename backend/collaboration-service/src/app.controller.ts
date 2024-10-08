import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SessionOperationRequestDto } from './dto/session-operation-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // this.appService.subscribeToOperationChannel();
  }
}
