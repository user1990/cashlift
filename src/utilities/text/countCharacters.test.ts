import { describe, expect, it } from "vitest";
import { countCharacters } from "./countCharacters";

describe("countCharacters", () => {
	it.each`
		value         | expected
		${"👨‍👩‍👧"}   | ${1}
		${"🇺🇸"}       | ${1}
		${"👍🏾"}     | ${1}
		${"Hello 🌍"} | ${7}
		${"Kuvro"}    | ${5}
	`("counts $value as $expected user-visible characters", ({ expected, value }) => {
		expect(countCharacters(value)).toEqual(expected);
	});
});
