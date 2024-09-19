import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FindQuestionByIdDto, GetQuestionsDto } from './dto';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'This is the questions service!';
  }

  getQuestions(
    page: number,
    limit: number,
    searchQuery?: string,
    difficulty?: string,
    categories?: string[],
  ) {
    const payload: GetQuestionsDto = {
      page,
      limit,
      searchQuery,
      difficulty,
      categories,
    };
    return this.questionClient.send({ cmd: 'get_questions' }, payload);
  }

  getQuestionDetails(id: string) {
    const payload: FindQuestionByIdDto = { id };
    return this.questionClient.send({ cmd: 'get_question_details' }, payload);
  }
}
