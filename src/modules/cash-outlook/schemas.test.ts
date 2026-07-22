import { describe, expect, it } from "vitest";
import { forecastPointSchema } from "./schemas";

const FORECAST_POINT_MOCK = {
	date: "2026-05-14",
	id: "forecast-1",
	inflowCents: 100_000,
	openingBalanceCents: 200_000,
	outflowCents: 50_000,
	scenario: "base",
};

describe("forecastPointSchema", () => {
	it.each([
		[FORECAST_POINT_MOCK, true],
		[{ ...FORECAST_POINT_MOCK, date: "14/05/2026" }, false],
		[{ ...FORECAST_POINT_MOCK, inflowCents: -1 }, false],
		[{ ...FORECAST_POINT_MOCK, openingBalanceCents: 1.5 }, false],
	])("validates persisted forecast values", (value, valid) => {
		expect(forecastPointSchema.safeParse(value).success).toBe(valid);
	});
});
