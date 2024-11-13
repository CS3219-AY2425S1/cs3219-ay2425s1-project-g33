import { z } from "zod";

const RoleEnum = z.enum(["user", "admin"]);

type Role = z.infer<typeof RoleEnum>;

export { RoleEnum, type Role };
