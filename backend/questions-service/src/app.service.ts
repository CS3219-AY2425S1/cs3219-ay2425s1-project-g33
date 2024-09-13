import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schema/question.schema';

@Injectable()
export class AppService {

  constructor(@InjectModel('Question') private readonly questionModel: Model<Question>) {}

  async getQuestions(page: number = 1, limit: number = 10): Promise<Question[]> {
    const skip = (page - 1) * limit;
    
    const questions = await this.questionModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    return questions;
  }
}
