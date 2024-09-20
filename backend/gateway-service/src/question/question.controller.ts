import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  getHello(): string {
    return this.questionService.getHello();
  }

  @Get('questions')
  getQuestions() {
    return this.questionService.getQuestions();
  }
}
