import { Question } from 'src/schema/question.schema';

export interface GetQuestionsResponse {
  questions: Partial<Question>[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
