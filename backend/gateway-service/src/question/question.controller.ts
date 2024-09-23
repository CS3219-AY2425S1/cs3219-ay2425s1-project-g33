import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, GetQuestionsDto } from './dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // Get questions
  @Get()
  getQuestions(@Query() dto: GetQuestionsDto) {
    return this.questionService.getQuestions(dto);
  }

  // Get question details by slug
  @Get(':slug')
  getQuestionDetailsBySlug(@Param('slug') slug: string) {
    return this.questionService.getQuestionDetailsBySlug(slug);
  }

  // Create question
  @Post('create')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionService.createQuestion(dto);
  }

  // Delete question
  @Delete(':id')
  deleteQuestion(@Param('id') id: string) {
    return this.questionService.deleteQuestion(id);
  }
}
