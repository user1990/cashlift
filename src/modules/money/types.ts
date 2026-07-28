import type { z } from "zod";
import type { MONEY_CENTS_SCHEMA } from "./schemas";

export type MoneyCents = z.infer<typeof MONEY_CENTS_SCHEMA>;
