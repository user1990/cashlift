import type { z } from "zod";
import type { moneyCentsSchema } from "./schemas";

export type MoneyCents = z.infer<typeof moneyCentsSchema>;
