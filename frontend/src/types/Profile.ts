import { z } from "zod";
import { createResponseSchema } from "./Response";

const ProfileSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  email: z.string(),
  provider: z.string(),
  profilePictureUrl: z.string(),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
  languages: z.string().array(),
  isOnboarded: z.boolean(),
});


const ProfileResponseSchema = createResponseSchema(ProfileSchema);
const UpdateProfileSchema = ProfileSchema.omit({ email: true, provider: true, profilePictureUrl: true, isOnboarded: true, languages: true });

type Profile = z.infer<typeof ProfileSchema>;
type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export {
  ProfileSchema,
  ProfileResponseSchema,
  UpdateProfileSchema,
  type Profile,
  type ProfileResponse,
  type UpdateProfile,
};