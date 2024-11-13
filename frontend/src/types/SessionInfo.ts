import { z } from "zod";
import { createResponseSchema } from "./Response";
import { DifficultyEnum } from "./Question";
import { CategorySchema } from "./Category";

export const SessionInfoSchema = z.object({
  id: z.string(),
  difficultyPreference: DifficultyEnum,
  topicPreference: z.array(CategorySchema),
  questionId: z.string(), // String question ID
  userIds: z.array(z.string()), // Array of user ID strings
  status: z.enum(["active", "completed"]), // Enum for status
  endedAt: z.nullable(z.string().datetime()), // Nullable ISO date string
  createdAt: z.string().datetime(), // ISO date string
  updatedAt: z.string().datetime(), // ISO date string
});

export const SessionHistorySchema = z.object({
  sessionId: z.string(),
  status: z.enum(["active", "completed"]),
});

export const SessionHistoryDataSchema = z.array(SessionHistorySchema);

export const SessionJoinRequestSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
});

export const SessionInfoResponseSchema =
  createResponseSchema(SessionInfoSchema);

export const SessionHistoryResponseSchema = createResponseSchema(
  SessionHistoryDataSchema
);

export type SessionInfo = z.infer<typeof SessionInfoSchema>;
export type SessionHistory = z.infer<typeof SessionHistorySchema>;
export type SessionHistoryData = z.infer<typeof SessionHistoryDataSchema>;

export type SessionJoinRequest = z.infer<typeof SessionJoinRequestSchema>;
export type SessionInfoResponse = z.infer<typeof SessionInfoResponseSchema>;
export type HistorySessionInfoResponse = z.infer<
  typeof SessionHistoryResponseSchema
>;
