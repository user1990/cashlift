import { z } from "zod";
import { moneyCentsSchema } from "@/modules/money/schemas";

export const forecastPointSchema = z.object({
	date: z.string(),
	id: z.string(),
	inflowCents: moneyCentsSchema,
	openingBalanceCents: moneyCentsSchema,
	outflowCents: moneyCentsSchema,
	scenario: z.enum(["base", "delayed-client", "approved-spend"]),
});
