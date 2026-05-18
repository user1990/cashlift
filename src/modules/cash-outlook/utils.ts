import type { ForecastPoint } from "./types";

export const getEndingBalance = (point: ForecastPoint) =>
	point.openingBalanceCents + point.inflowCents - point.outflowCents;
