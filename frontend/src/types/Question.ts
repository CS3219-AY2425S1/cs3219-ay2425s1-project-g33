import { z } from "zod";
import { createResponseSchema } from "./Response";
import { CategoriesSchema } from "./Category";

const DifficultyEnum = z.enum(["Easy", "Medium", "Hard"]);

const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
});

const QuestionSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  difficulty: DifficultyEnum,
  categories: CategoriesSchema,
  testCases: z.array(TestCaseSchema),
});

const NewQuestionSchema = QuestionSchema.omit({
  _id: true,
  slug: true,
  testCases: true,
});

const EditQuestionSchema = QuestionSchema.omit({
  testCases: true,
});

const QuestionsSchema = z.array(QuestionSchema);

const QuestionsDataSchema = z.object({
  questions: QuestionsSchema,
});

const QuestionResponseSchema = createResponseSchema(QuestionSchema);
const QuestionsResponseSchema = createResponseSchema(QuestionsDataSchema);

type Difficulty = z.infer<typeof DifficultyEnum>;
type TestCase = z.infer<typeof TestCaseSchema>;
type Question = z.infer<typeof QuestionSchema>;
type NewQuestion = z.infer<typeof NewQuestionSchema>;
type EditQuestion = z.infer<typeof EditQuestionSchema>;
type Questions = z.infer<typeof QuestionsSchema>;
type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
type QuestionsResponse = z.infer<typeof QuestionsResponseSchema>;

export {
  DifficultyEnum,
  TestCaseSchema,
  QuestionSchema,
  NewQuestionSchema,
  QuestionsSchema,
  QuestionsDataSchema,
  QuestionResponseSchema,
  QuestionsResponseSchema,
  type Difficulty,
  type TestCase,
  type Question,
  type NewQuestion,
  type EditQuestion,
  type Questions,
  type QuestionResponse,
  type QuestionsResponse,
};
