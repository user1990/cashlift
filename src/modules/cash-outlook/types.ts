import type { MoneyCents } from "@/modules/money/types";

export type ForecastPoint = {
	date: string;
	id: string;
	inflowCents: MoneyCents;
	openingBalanceCents: MoneyCents;
	outflowCents: MoneyCents;
	scenario: "base" | "delayed-client" | "approved-spend";
};
