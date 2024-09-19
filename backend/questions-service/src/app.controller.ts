import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindQuestionByIdDto, GetQuestionsDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_questions' })
  async getQuestions(@Payload() data: GetQuestionsDto) {
    const { page, limit, searchQuery, difficulty, categories } = data;
    return this.appService.getQuestions(
      page,
      limit,
      searchQuery,
      difficulty,
      categories,
    );
  }

  @MessagePattern({ cmd: 'get_question_details' })
  async getQuestionDetails(@Payload() data: FindQuestionByIdDto) {
    const { id } = data;
    return this.appService.getQuestionDetails(id);
  }
}
