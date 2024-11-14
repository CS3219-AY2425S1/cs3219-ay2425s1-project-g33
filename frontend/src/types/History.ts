import { z } from "zod";

export const HistoryItemSchema = z.object({
  sessionId: z.string(),
  difficultyPreference: z.string(),
  topicPreference: z.array(z.string()),
  question: z.object({
    id: z.string(),
    title: z.string(),
  }),
  status: z.string(),
  date: z.string(),
});

const HistoryResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.array(HistoryItemSchema), // Data should be an array of history items
});

type HistoryItem = z.infer<typeof HistoryItemSchema>;
type HistoryResponse = z.infer<typeof HistoryResponseSchema>;

export {
    HistoryResponseSchema,
    type HistoryItem,
    type HistoryResponse,
  };
  