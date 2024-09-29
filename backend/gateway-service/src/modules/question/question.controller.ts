import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateQuestionDto,
  FindQuestionBySlugDto,
  GetQuestionsDto,
  UpdateQuestionDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from 'src/common/decorators';

@ApiTags('questions')
@Public()
@Controller('questions')
export class QuestionController {
  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {}

  // Get questions
  @Get()
  getQuestions(@Query() dto: GetQuestionsDto) {
    return this.questionClient.send({ cmd: 'get-questions' }, dto);
  }

  // Get question categories
  @Get('categories')
  getQuestionCategories() {
    return this.questionClient.send({ cmd: 'get-categories' }, {});
  }

  // Get question details by slug
  @Get(':slug')
  getQuestionDetailsBySlug(@Param('slug') slug: string) {
    const payload: FindQuestionBySlugDto = { slug };
    return this.questionClient.send({ cmd: 'get-question-details' }, payload);
  }

  // Create question
  @Post('create')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionClient.send({ cmd: 'create-question' }, dto);
  }

  // Delete question
  @Delete(':id')
  deleteQuestion(@Param('id') id: string) {
    return this.questionClient.send({ cmd: 'delete-question' }, id);
  }

  // Update question
  @Patch(':id')
  updateQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    const payload: UpdateQuestionDto = { id, updatedQuestionInfo: dto };
    return this.questionClient.send({ cmd: 'update-question' }, payload);
  }
}
