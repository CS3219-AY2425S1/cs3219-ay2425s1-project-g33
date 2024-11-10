import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSessionDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get-session-details-by-id' })
  async handleGetSessionDetails(@Payload() data: { id: string }) {
    const sessionDetails = await this.appService.getSessionDetails(data.id);
    return sessionDetails;
  }

  @MessagePattern({ cmd: 'create-session' })
  async handleCreateSession(@Payload() data: CreateSessionDto) {
    const sessionDetails = await this.appService.createSession(data);
    return sessionDetails;
  }
}
