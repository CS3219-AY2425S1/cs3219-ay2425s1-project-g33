import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MatchRequestDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('match-request')
  async handleMatchRequest(@Payload() data: MatchRequestDto) {
    return this.appService.requestMatch(data);
  }

  @MessagePattern('match-cancel')
  async handleMatchCancel(@Payload() data: { userId: string }) {
    return this.appService.cancelMatch(data.userId);
  }

  @EventPattern('match-confirmed')
  async handleMatchConfirmed(@Payload() data: { matchId: string, sessionId: string}) {
    return this.appService.matchConfirmed(data.matchId, data.sessionId);
  }

  @EventPattern('match-declined')
  async handleMatchDeclined(@Payload() data: { matchId: string}) {
    return this.appService.matchDeclined(data.matchId);
  }

  @MessagePattern('match-history')
  async handleMatchHistoryBySessionId(@Payload() data: { sessionId: string }) {
    return this.appService.getMatchHistory(data.sessionId);
  }
}
