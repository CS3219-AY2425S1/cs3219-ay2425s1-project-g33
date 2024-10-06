import { z } from "zod";

export const UserProfileSchema = z.object({
  email: z.string(),
  roles: z.string().array(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
