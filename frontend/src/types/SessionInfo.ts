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
  status: z.enum(["active", "inactive"]), // Enum for status
  endedAt: z.nullable(z.string().datetime()), // Nullable ISO date string
  createdAt: z.string().datetime(), // ISO date string
  updatedAt: z.string().datetime(), // ISO date string
});

export const SessionJoinRequestSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
});

export const SessionInfoResponseSchema =
  createResponseSchema(SessionInfoSchema);

export type SessionInfo = z.infer<typeof SessionInfoSchema>;

export type SessionJoinRequest = z.infer<typeof SessionJoinRequestSchema>;
export type SessionInfoResponse = z.infer<typeof SessionInfoResponseSchema>;
