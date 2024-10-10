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
  UseGuards,
} from '@nestjs/common';
import {
  CreateQuestionDto,
  FindQuestionBySlugDto,
  GetQuestionsDto,
  UpdateQuestionDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { RolesGuard } from 'src/common/guards';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorators';

@ApiTags('questions')
@ApiBearerAuth('access-token')
@Controller('questions')
export class QuestionController {
  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {}

  // Get questions
  @Get()
  @ApiOkResponse({ description: 'Get questions successfully' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  getQuestions(@Query() dto: GetQuestionsDto) {
    return this.questionClient.send({ cmd: 'get-questions' }, dto);
  }

  // Get question categories
  @Get('categories')
  @ApiOkResponse({ description: 'Get question categories successfully' })
  getQuestionCategories() {
    return this.questionClient.send({ cmd: 'get-categories' }, {});
  }

  // Get question details by slug
  @Get(':slug')
  @ApiOkResponse({ description: 'Get question details by slug successfully' })
  @ApiBadRequestResponse({ description: 'Invalid slug' })
  getQuestionDetailsBySlug(@Param('slug') slug: string) {
    const payload: FindQuestionBySlugDto = { slug };
    return this.questionClient.send({ cmd: 'get-question-details' }, payload);
  }

  // Create question
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({ description: 'Create question successfully' })
  @ApiBadRequestResponse({ description: 'Invalid question data provided' })
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionClient.send({ cmd: 'create-question' }, dto);
  }

  // Delete question
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Delete question successfully' })
  @ApiBadRequestResponse({ description: 'Invalid question id' })
  deleteQuestion(@Param('id') id: string) {
    return this.questionClient.send({ cmd: 'delete-question' }, id);
  }

  // Update question
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Update question successfully' })
  @ApiBadRequestResponse({ description: 'Invalid question data' })
  updateQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    const payload: UpdateQuestionDto = { id, updatedQuestionInfo: dto };
    return this.questionClient.send({ cmd: 'update-question' }, payload);
  }
}
