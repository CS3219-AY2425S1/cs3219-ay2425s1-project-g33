import { z } from "zod";
import { DifficultyEnum } from "./Question";
import { CategoriesSchema } from "./Category";

// What we send to the backend
export const MatchRequestSchema = z.object({
  userId: z.string(),
  selectedTopic: CategoriesSchema,
  selectedDifficulty: DifficultyEnum,
});

// What we get back from the backend
// (Missing event in backend) (To be implemented later)
export const MatchResponseSchema = z.object({
  // Maybe a UserProfile object or something similar to show who you have matched with
  matchId: z.string(),
  matchedUsers: z.string(),
});

export const MatchSuccessResponseSchema = z.object({
  message: z.string(),
  matchedUserId: z.string(),
});

export const MatchTimeoutResponseSchema = z.object({
  message: z.string(),
  timedOutUserId: z.string(),
});

export type MatchRequest = z.infer<typeof MatchRequestSchema>;
export type MatchResponse = z.infer<typeof MatchResponseSchema>;

export type MatchSuccessResponse = z.infer<typeof MatchSuccessResponseSchema>;
export type MatchTimeoutResponse = z.infer<typeof MatchTimeoutResponseSchema>;
