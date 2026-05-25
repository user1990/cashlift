import { describe, expect, it } from "vitest";
import { leadCaptureSchema } from "./schemas";

describe("leadCaptureSchema", () => {
	it("validates name and company lengths with user-visible characters", () => {
		expect(
			leadCaptureSchema.safeParse({
				company: "👨‍👩‍👧👨‍👩‍👧",
				email: "finance@kuvro.test",
				name: "👍🏾👍🏾",
			}).success,
		).toEqual(true);

		expect(
			leadCaptureSchema.safeParse({
				company: "👨‍👩‍👧",
				email: "finance@kuvro.test",
				name: "👍🏾",
			}).success,
		).toEqual(false);
	});
});
