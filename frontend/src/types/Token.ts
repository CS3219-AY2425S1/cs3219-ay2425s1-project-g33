import { z } from "zod";
import { createResponseSchema } from "./Response";

export const AccessTokenSchema = z.string();
export const RefreshTokenSchema = z.string();

export const TokenPairSchema = z.object({
  access_token: AccessTokenSchema,
  refresh_token: RefreshTokenSchema,
});

export const AccessOnlySchema = TokenPairSchema.omit({
  refresh_token: true,
});

export const TokenPairResponseSchema = createResponseSchema(TokenPairSchema);
export const AccessTokenResponseSchema = createResponseSchema(AccessOnlySchema);

export const AccessTokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  isOnboarded: z.boolean(),
  roles: z.string().array(),
  iat: z.number(),
  exp: z.number(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type TokenPairResponse = z.infer<typeof TokenPairResponseSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
