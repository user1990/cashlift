import { describe, expect, it } from "vitest";
import { forecastPointSchema } from "./schemas";

const point = {
	date: "2026-05-14",
	id: "forecast-1",
	inflowCents: 100_000,
	openingBalanceCents: 200_000,
	outflowCents: 50_000,
	scenario: "base",
};

describe("forecastPointSchema", () => {
	it.each([
		[point, true],
		[{ ...point, date: "14/05/2026" }, false],
		[{ ...point, inflowCents: -1 }, false],
		[{ ...point, openingBalanceCents: 1.5 }, false],
	])("validates persisted forecast values", (value, valid) => {
		expect(forecastPointSchema.safeParse(value).success).toBe(valid);
	});
});
