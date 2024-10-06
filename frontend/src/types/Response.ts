import { z } from "zod";

export const createResponseSchema = <T extends z.ZodType<z.AnyZodObject>>(
  dataSchema: T | z.ZodTypeAny
) => {
  return z.object({
    statusCode: z.any(),
    message: z.string(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });
};
