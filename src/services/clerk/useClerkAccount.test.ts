import { describe, expect, it } from "vitest";
import { getClerkAccountDetails } from "./useClerkAccount";

describe("getClerkAccountDetails", () => {
	it.each([
		{ loaded: false, user: undefined },
		{ loaded: true, user: null },
	])("keeps account actions unavailable until an authenticated user is loaded", ({ loaded, user }) => {
		expect(getClerkAccountDetails({ loaded, user })).toBeNull();
	});
});
