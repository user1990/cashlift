import { describe, expect, it } from "vitest";
import { SPEND_REQUEST_DECISION_SCHEMA } from "./schemas";

const REQUEST_ID_MOCK = "request-1";

describe("SPEND_REQUEST_DECISION_SCHEMA", () => {
	it.each([
		["approved", true],
		["rejected", true],
		["pending", false],
	])("accepts only final decision statuses", (status, valid) => {
		expect(SPEND_REQUEST_DECISION_SCHEMA.safeParse({ id: REQUEST_ID_MOCK, status }).success).toBe(valid);
	});
});
