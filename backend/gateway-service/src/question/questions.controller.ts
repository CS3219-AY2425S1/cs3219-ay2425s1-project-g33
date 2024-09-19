import { Body, Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { GetQuestionsDto } from './dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  getHello(): string {
    return this.questionService.getHello();
  }

  @Get('questions')
  getQuestions(@Body() dto: GetQuestionsDto) {
    const { page, limit, searchQuery, difficulty, categories } = dto;
    return this.questionService.getQuestions(
      page,
      limit,
      searchQuery,
      difficulty,
      categories,
    );
  }

  @Get(':id')
  getQuestionDetails(@Param('id') id: string) {
    return this.questionService.getQuestionDetails(id);
  }
}
