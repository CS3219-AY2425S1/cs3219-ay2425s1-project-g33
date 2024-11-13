import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CodeReviewDto, CreateSessionDto } from './dto';
import { CodeReviewService } from './code-review.service';
import { ChatSendMessageRequestDto } from './dto/add-chat-message-request.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly codeReviewService: CodeReviewService,
  ) {}

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

  @MessagePattern({ cmd: 'review-code' })
  async handleReviewCode(@Payload() data: CodeReviewDto) {
    // Here, sessionId is needed to retrieve the questionId (which should ideally be stored in the session details)
    const { sessionId, code } = data;
    const review = await this.codeReviewService.reviewCode(sessionId, code);
    return review;
  }

  @MessagePattern({ cmd: 'get-user-session-history' })
  async handleGetUserSessionHistory(@Payload() data: { userId: string }) {
    const sessionHistory = await this.appService.getUserSessionHistory(
      data.userId,
    );
    return sessionHistory;
  }

  @MessagePattern({ cmd: 'update-session-status' })
  async handleUpdateSessionStatus(
    @Payload() data: { id: string; status: string },
  ) {
    console.log('called update session status');
    return await this.appService.updateSessionStatus(data.id, data.status);
  }

  @MessagePattern({ cmd: 'add-chat-message' })
  async handleAddChatMessage(@Payload() data: ChatSendMessageRequestDto) {
    console.log('add-chat-message controller service invoked');
    return await this.appService.addChatMessage(data);
  }

  @MessagePattern({ cmd: 'get-session-chat-messages' })
  async handleGetSessionChatMessages(@Payload() id: string) {
    return await this.appService.getAllChatMessages(id);
  }
}
