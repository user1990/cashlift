import assert from "node:assert/strict";
import test from "node:test";
import { END_MARKER, START_MARKER, upsertRecapBlock, validateRecapBlock } from "./upsert-recap-block.mjs";

const recap = `${START_MARKER}

<details>
<summary>System recap</summary>
</details>

${END_MARKER}`;

test("appends a recap without changing the existing body", () => {
	assert.equal(upsertRecapBlock("## Description\n\nKeep me.\n", recap), `## Description\n\nKeep me.\n\n${recap}\n`);
});

test("uses the recap as the complete empty body", () => {
	assert.equal(upsertRecapBlock("", recap), `${recap}\n`);
});

test("replaces only the existing recap block", () => {
	const body = `Before\n\n${START_MARKER}\nold\n${END_MARKER}\n\nAfter`;

	assert.equal(upsertRecapBlock(body, recap), `Before\n\n${recap}\n\nAfter`);
});

test("rejects incomplete and duplicate markers in a PR body", () => {
	assert.throws(() => upsertRecapBlock(`Body\n${START_MARKER}`, recap), /incomplete or duplicate/);
	assert.throws(
		() => upsertRecapBlock(`${START_MARKER}\nold\n${END_MARKER}\n${START_MARKER}\nagain\n${END_MARKER}`, recap),
		/incomplete or duplicate/,
	);
	assert.throws(() => upsertRecapBlock(`${END_MARKER}\nold\n${START_MARKER}`, recap), /out-of-order/);
});

test("rejects malformed recap input", () => {
	assert.throws(() => validateRecapBlock(`<details />\n${END_MARKER}`), /one ordered marker pair/);
	assert.throws(() => validateRecapBlock(`${START_MARKER}\n${END_MARKER}\ntrailing`), /one ordered marker pair/);
});
