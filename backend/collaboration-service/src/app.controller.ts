import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get-session-details-by-id' })
  async handleGetSessionDetails(@Payload() data: { id: string }) {
    // Process the get session details using the AppService
    const sessionDetails = await this.appService.getSessionDetails(data.id);
    return sessionDetails;
  }
}
