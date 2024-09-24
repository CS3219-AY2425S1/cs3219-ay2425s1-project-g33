import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateQuestionDto,
  FindQuestionBySlugDto,
  GetQuestionsDto,
  UpdateQuestionDto,
} from './dto';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {}

  getQuestions(data: GetQuestionsDto) {
    return this.questionClient.send({ cmd: 'get_questions' }, data);
  }

  getQuestionDetailsBySlug(slug: string) {
    const payload: FindQuestionBySlugDto = { slug };
    return this.questionClient.send({ cmd: 'get_question_details' }, payload);
  }

  createQuestion(data: CreateQuestionDto) {
    return this.questionClient.send({ cmd: 'create_question' }, data);
  }

  deleteQuestion(id: string) {
    return this.questionClient.send({ cmd: 'delete_question' }, id);
  }

  updateQuestion(id: string, data: CreateQuestionDto) {
    const payload: UpdateQuestionDto = { id, updatedQuestionInfo: data };
    return this.questionClient.send({ cmd: 'update_question' }, payload);
  }
}
