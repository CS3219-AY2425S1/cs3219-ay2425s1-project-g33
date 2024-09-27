import { Question } from 'src/schema/question.schema';

export interface GetQuestionsResponse {
  questions: Partial<Question>[];
  totalCategories: string[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
