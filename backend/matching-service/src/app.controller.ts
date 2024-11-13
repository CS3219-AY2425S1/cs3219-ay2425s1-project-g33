import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchRequestDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'match-request' })
  async handleMatchRequest(@Payload() data: MatchRequestDto) {
    return this.appService.requestMatch(data);
  }

  @MessagePattern({ cmd: 'match-cancel' })
  async handleMatchCancel(@Payload() data: { userId: string }) {
    return this.appService.cancelMatch(data.userId);
  }

  @MessagePattern({ cmd: 'get-match-details' })
  async handleMatchDetails(@Payload() data: { matchId: string }) {
    return this.appService.getMatchDetails(data.matchId);
  }
}
