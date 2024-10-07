import { z } from "zod";
import { ProficiencyEnum } from "./Proficiency";
import { LanguageEnum } from "./Languages";
import { RoleEnum } from "./Role";
import { createResponseSchema } from "./Response";

const UserProfileSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  roles: z.array(RoleEnum),
  proficiency: ProficiencyEnum,
  languages: z.array(LanguageEnum),
  isOnboarded: z.boolean(),
});

const UpdateUserProfileSchema = UserProfileSchema.omit({ email: true, roles: true });

const UserProfileResponseSchema = createResponseSchema(UserProfileSchema);

type UserProfile = z.infer<typeof UserProfileSchema>;
type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>
type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

export {
  UserProfileSchema,
  UserProfileResponseSchema,
  UpdateUserProfileSchema,
  type UserProfile,
  type UserProfileResponse,
  type UpdateUserProfile,
}
