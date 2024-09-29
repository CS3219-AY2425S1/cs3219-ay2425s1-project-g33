import { z } from "zod";

export const createResponseSchema = <T extends z.ZodType<object>>(
  dataSchema: T
) => {
  return z.object({
    statusCode: z.any(),
    message: z.string(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });
};
