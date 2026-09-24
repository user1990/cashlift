import { describe, expect, it } from "vitest";
import { dueWithinWindow } from "./dueWithinWindow";

describe("dueWithinWindow", () => {
	it("checks due dates inside future and overdue windows", () => {
		const date = new Date("2026-05-09");

		expect(dueWithinWindow("2026-05-14", date, 14)).toEqual(true);
		expect(dueWithinWindow("2026-06-14", date, 14)).toEqual(false);
		expect(dueWithinWindow("2026-05-08", date, -1)).toEqual(true);
	});
});
