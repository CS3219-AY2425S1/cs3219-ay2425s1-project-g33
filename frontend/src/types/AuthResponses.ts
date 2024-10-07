import { z } from "zod";
import { createResponseSchema } from "./Response";

export const LogoutResposeSchema = createResponseSchema(z.boolean());
export type LogoutResponse = z.infer<typeof LogoutResposeSchema>;
