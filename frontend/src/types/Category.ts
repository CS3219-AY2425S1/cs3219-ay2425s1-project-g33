import { z } from "zod";
import { createResponseSchema } from "./Response";

export const CategorySchema = z.string();

export const CategoriesSchema = z.array(CategorySchema);

export const CategoryDataSchema = z.object({
  categories: CategoriesSchema,
});

export const CategoriesResponseSchema =
  createResponseSchema(CategoryDataSchema);

export type Category = z.infer<typeof CategorySchema>;
export type Categories = z.infer<typeof CategoriesSchema>;

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
