import { z } from "zod";

export const QuestionSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  categories: z.array(z.string()),
});

export const QuestionsArraySchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;

export type Questions = z.infer<typeof QuestionsArraySchema>;
