import { z } from "zod";

// Schema for login credentials (email and password)
export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Schema for signup data (email, password, and username)
export const SignupDataSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Types based on the schemas
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type SignupData = z.infer<typeof SignupDataSchema>;
