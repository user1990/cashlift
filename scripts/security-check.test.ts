import { describe, expect, it } from "vitest";
import { isProhibitedTrackedFilename } from "./security-check.mjs";

describe("security filename rules", () => {
	it.each([".env", ".env.local", ".env.production", "public/app.js.map"])(
		"rejects prohibited tracked filename %s",
		(file) => {
			expect(isProhibitedTrackedFilename(file)).toBe(true);
		},
	);

	it("allows ordinary source files through the filename rule", () => {
		expect(isProhibitedTrackedFilename("src/app/page.tsx")).toBe(false);
	});
});
