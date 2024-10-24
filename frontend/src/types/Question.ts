import { z } from "zod";
import { createResponseSchema } from "./Response";
import { CategoriesSchema } from "./Category";

const DifficultyEnum = z.enum(["Easy", "Medium", "Hard"]);

const QuestionSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  difficulty: DifficultyEnum,
  categories: CategoriesSchema,
});

const NewQuestionSchema = QuestionSchema.omit({ _id: true, slug: true });

const QuestionsSchema = z.array(QuestionSchema);

const QuestionsDataSchema = z.object({
  questions: QuestionsSchema,
});

const QuestionResponseSchema = createResponseSchema(QuestionSchema);
const QuestionsResponseSchema = createResponseSchema(QuestionsDataSchema);

type Difficulty = z.infer<typeof DifficultyEnum>;
type Question = z.infer<typeof QuestionSchema>;
type NewQuestion = z.infer<typeof NewQuestionSchema>;
type Questions = z.infer<typeof QuestionsSchema>;
type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
type QuestionsResponse = z.infer<typeof QuestionsResponseSchema>;

export {
  DifficultyEnum,
  QuestionSchema,
  NewQuestionSchema,
  QuestionsSchema,
  QuestionsDataSchema,
  QuestionResponseSchema,
  QuestionsResponseSchema,
  type Difficulty,
  type Question,
  type NewQuestion,
  type Questions,
  type QuestionResponse,
  type QuestionsResponse,
};
