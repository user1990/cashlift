import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const forecastPointSchema = z.object({
	date: z.iso.date(),
	id: z.string(),
	inflowCents: moneyCentsSchema.nonnegative(),
	openingBalanceCents: moneyCentsSchema.nonnegative(),
	outflowCents: moneyCentsSchema.nonnegative(),
	scenario: z.enum(["base", "delayed-client", "approved-spend"]),
});
