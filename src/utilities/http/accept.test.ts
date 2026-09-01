import { describe, expect, it } from "vitest";
import { preferredContentType } from "./accept";

describe("preferredContentType", () => {
	it.each([
		[null, "text/html"],
		["*/*", "text/html"],
		["text/markdown", "text/markdown"],
		["text/html, text/markdown;q=0.9", "text/html"],
		["text/markdown;q=0.9, text/html;q=0.8", "text/markdown"],
		["text/html;q=0, */*;q=1", "text/markdown"],
		["application/json", null],
	] as const)("negotiates %s as %s", (header, expected) => {
		expect(preferredContentType(header)).toBe(expected);
	});
});
