import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from './schema/question.schema';
import { GetQuestionsDto } from './dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  async getQuestions(
    page: number,
    limit: number,
    searchQuery: string,
    difficulty: string,
    categories: string[],
  ): Promise<Partial<Question>[]> {
    const skip = (page - 1) * limit;
    const filters: any = {};
    if (difficulty) {
      filters.difficulty = difficulty;
    }

    if (categories && categories.length > 0) {
      filters.categories = { $in: categories };
    }

    if (searchQuery) {
      filters.title = { $regex: searchQuery, $options: 'i' };
    }

    const attributes = {
      title: 1,
      slug: 1,
      questionId: 1,
      difficulty: 1,
      categories: 1,
    };
    const questions = await this.questionModel
      .find(filters)
      .skip(skip)
      .limit(limit)
      .select(attributes)
      .exec();

    return questions;
  }

  async getQuestionDetails(id: string): Promise<Question> {
    const question = await this.questionModel
      .findById(new Types.ObjectId(id))
      .exec();
    if (!question) {
      throw new Error('Question not found');
    }
    return question;
  }
}
