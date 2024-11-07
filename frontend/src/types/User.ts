import { z } from "zod";
import { ProficiencyEnum } from "./Proficiency";
import { LanguageEnum } from "./Languages";
import { RoleEnum } from "./Role";
import { createResponseSchema } from "./Response";

const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  roles: z.array(RoleEnum),
  proficiency: ProficiencyEnum,
  languages: z.array(LanguageEnum),
  isOnboarded: z.boolean(),
  //profilePictureUrl: z.string(),
});

const UserProfilesSchema = z.array(UserProfileSchema);

const SessionUserProfileSchema = UserProfileSchema.extend({
  isActive: z.boolean(),
});

const SessionUserProfilesSchema = z.array(SessionUserProfileSchema);

const UpdateUserProfileSchema = UserProfileSchema.omit({
  id: true,
  email: true,
  roles: true,
});

const UserProfileResponseSchema = createResponseSchema(UserProfileSchema);

type UserProfile = z.infer<typeof UserProfileSchema>;
type UserProfiles = z.infer<typeof UserProfilesSchema>;
type SessionUserProfile = z.infer<typeof SessionUserProfileSchema>;
type SessionUserProfiles = z.infer<typeof SessionUserProfilesSchema>;
type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

export {
  UserProfileSchema,
  UserProfilesSchema,
  SessionUserProfileSchema,
  SessionUserProfilesSchema,
  UserProfileResponseSchema,
  UpdateUserProfileSchema,
  type UserProfile,
  type UserProfiles,
  type SessionUserProfile,
  type SessionUserProfiles,
  type UserProfileResponse,
  type UpdateUserProfile,
};
