import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Difficulty Enum
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

// Language Enum (for different coding languages supported)
export enum SupportedLanguages {
  PYTHON = 'Python',
  JAVA = 'Java',
  CPLUSPLUS = 'C++',
}

// Question Schema
@Schema()
export class Question extends Document {
  
  // Title of the question
  @Prop({ required: true })
  title: string;

  // Unique identifier or slug for the question URL
  @Prop({ required: true, unique: true })
  slug: string;

  // Description or prompt explaining the problem
  @Prop({ required: true })
  description: string;

  // An array of categories the question belongs to
  @Prop({ required: true, type: [String] })
  categories: string[];

  // Difficulty level (Easy, Medium, Hard)
  @Prop({ required: true, enum: Difficulty })
  difficulty: Difficulty;

  // An array of supported languages for solving the problem
  @Prop({ required: true, enum: SupportedLanguages, type: [String] })
  supportedLanguages: SupportedLanguages[];

}

// Generate the Mongoose schema
export const QuestionSchema = SchemaFactory.createForClass(Question);
