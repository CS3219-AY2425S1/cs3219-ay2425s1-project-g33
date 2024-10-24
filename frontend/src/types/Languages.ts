import { z } from "zod";

const LanguageEnum = z.enum(["Python", "Java", "C++"]);

type Language = z.infer<typeof LanguageEnum>;

export { LanguageEnum, type Language };
