import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, GetQuestionsDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('questions')
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

  // Update question
  @Patch(':id')
  updateQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.questionService.updateQuestion(id, dto);
  }
}
