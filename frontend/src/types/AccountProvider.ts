import { z } from "zod";

const AccountProviderEnum = z.enum(["local", "google", "github"]);

type AccountProvider = z.infer<typeof AccountProviderEnum>;

export { AccountProviderEnum, type AccountProvider };
