import { describe, expect, it } from "vitest";
import { getRequiredClerkPublishableKey } from "./config";
import { getRequiredClerkSecretKey } from "./serverConfig";

describe("Clerk config", () => {
	it("returns configured Clerk keys", () => {
		expect(getRequiredClerkPublishableKey(" pk_live_test ")).toEqual("pk_live_test");
		expect(getRequiredClerkSecretKey(" sk_live_test ")).toEqual("sk_live_test");
	});

	it.each([
		["publishable key", () => getRequiredClerkPublishableKey(undefined), "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
		["secret key", () => getRequiredClerkSecretKey(" "), "CLERK_SECRET_KEY"],
	])("throws when the Clerk %s is missing", (_label, readConfig, keyName) => {
		expect(readConfig).toThrow(`${keyName} must be configured for Clerk authentication.`);
	});
});
