import { z } from "zod";

export const createQuestionFormSchema = z.object({
    title: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    categories: z.array(z.string()),
    description: z.string(),
  });

export type CreateQuestionFormSchema = z.infer<typeof createQuestionFormSchema>;