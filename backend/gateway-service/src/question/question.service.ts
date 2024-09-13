import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'This is the questions service!';
  }

  getQuestions() {
    return this.questionClient.send({ cmd: 'get_questions' }, {});
  }
}
