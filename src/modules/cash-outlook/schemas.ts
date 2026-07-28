import { z } from "zod";
import { MONEY_CENTS_SCHEMA } from "@/modules/money/schemas";

export const FORECAST_POINT_SCHEMA = z.object({
	date: z.iso.date(),
	id: z.string(),
	inflowCents: MONEY_CENTS_SCHEMA.nonnegative(),
	openingBalanceCents: MONEY_CENTS_SCHEMA.nonnegative(),
	outflowCents: MONEY_CENTS_SCHEMA.nonnegative(),
	scenario: z.enum(["base", "delayed-client", "approved-spend"]),
});
