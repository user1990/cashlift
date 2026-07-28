import { describe, expect, it } from "vitest";
import { FORECAST_POINT_SCHEMA } from "./schemas";

const FORECAST_POINT_MOCK = {
	date: "2026-05-14",
	id: "forecast-1",
	inflowCents: 100_000,
	openingBalanceCents: 200_000,
	outflowCents: 50_000,
	scenario: "base",
};

describe("FORECAST_POINT_SCHEMA", () => {
	it.each([
		[FORECAST_POINT_MOCK, true],
		[{ ...FORECAST_POINT_MOCK, date: "14/05/2026" }, false],
		[{ ...FORECAST_POINT_MOCK, inflowCents: -1 }, false],
		[{ ...FORECAST_POINT_MOCK, openingBalanceCents: 1.5 }, false],
	])("validates persisted forecast values", (value, valid) => {
		expect(FORECAST_POINT_SCHEMA.safeParse(value).success).toBe(valid);
	});
});
