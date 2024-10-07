import { z } from "zod";

const ProficiencyEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);

type Proficiency = z.infer<typeof ProficiencyEnum>;

export {
    ProficiencyEnum,
    type Proficiency,
}