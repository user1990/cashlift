import { describe, expect, it } from "vitest";
import { END_MARKER, START_MARKER, upsertRecapBlock, validateRecapBlock } from "./upsert-recap-block.mjs";

const recap = `${START_MARKER}

<details>
<summary>System recap</summary>
</details>

${END_MARKER}`;

describe("upsertRecapBlock", () => {
	it("appends a recap without changing the existing body", () => {
		expect(upsertRecapBlock("## Description\n\nKeep me.\n", recap)).toBe(`## Description\n\nKeep me.\n\n${recap}\n`);
	});

	it("uses the recap as the complete empty body", () => {
		expect(upsertRecapBlock("", recap)).toBe(`${recap}\n`);
	});

	it("replaces only the existing recap block", () => {
		const body = `Before\n\n${START_MARKER}\nold\n${END_MARKER}\n\nAfter`;

		expect(upsertRecapBlock(body, recap)).toBe(`Before\n\n${recap}\n\nAfter`);
	});

	it("rejects incomplete and duplicate markers in a PR body", () => {
		expect(() => upsertRecapBlock(`Body\n${START_MARKER}`, recap)).toThrow(/incomplete or duplicate/);
		expect(() =>
			upsertRecapBlock(`${START_MARKER}\nold\n${END_MARKER}\n${START_MARKER}\nagain\n${END_MARKER}`, recap),
		).toThrow(/incomplete or duplicate/);
		expect(() => upsertRecapBlock(`${END_MARKER}\nold\n${START_MARKER}`, recap)).toThrow(/out-of-order/);
	});

	it("rejects malformed recap input", () => {
		expect(() => validateRecapBlock(`<details />\n${END_MARKER}`)).toThrow(/one ordered marker pair/);
		expect(() => validateRecapBlock(`${START_MARKER}\n${END_MARKER}\ntrailing`)).toThrow(/one ordered marker pair/);
	});
});
