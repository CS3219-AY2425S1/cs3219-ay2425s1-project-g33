import { z } from "zod";
import { createResponseSchema } from "./Response";

const LogoutResposeSchema = createResponseSchema(z.boolean());
const RequestSSOUrlResponseSchema = createResponseSchema(z.string());

type RequestSSOUrlResponse = z.infer<typeof RequestSSOUrlResponseSchema>;
type LogoutResponse = z.infer<typeof LogoutResposeSchema>;

export {
  LogoutResposeSchema,
  RequestSSOUrlResponseSchema,
  type LogoutResponse,
  type RequestSSOUrlResponse,
};
