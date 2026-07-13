import { describe, expect, it } from "vitest";
import {
	CLERK_FRONTEND_API_PROXY_URL,
	clerkFrontendApiProxyEnabled,
	getClerkFrontendApiProxyUrl,
	getRequiredClerkPublishableKey,
} from "./config";
import { getRequiredClerkSecretKey } from "./serverConfig";

describe("Clerk config", () => {
	it("uses the app Clerk frontend API proxy path", () => {
		expect(CLERK_FRONTEND_API_PROXY_URL).toEqual("/__clerk");
	});

	it("only uses the Clerk frontend API proxy in production", () => {
		expect(clerkFrontendApiProxyEnabled("development")).toEqual(false);
		expect(clerkFrontendApiProxyEnabled("test")).toEqual(false);
		expect(clerkFrontendApiProxyEnabled("production")).toEqual(true);
		expect(getClerkFrontendApiProxyUrl()).toBeUndefined();
	});

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
