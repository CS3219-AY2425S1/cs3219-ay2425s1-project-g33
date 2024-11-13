import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Difficulty Enum
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

// Question Schema
@Schema({ versionKey: false })
export class Question extends Document {
  // Title of the question
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  questionNumber: number;

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

  // Test cases for the question
  @Prop({ required: true, type: [{ input: String, expectedOutput: String }] })
  testCases: { input: string; expectedOutput: string }[];
}

// Generate the Mongoose schema
export const QuestionSchema = SchemaFactory.createForClass(Question);
