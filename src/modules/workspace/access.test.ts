import { beforeEach, describe, expect, it, vi } from "vitest";

const AUTH_MOCK = vi.hoisted(() => vi.fn());
const CAPTURE_APP_EXCEPTION_MOCK = vi.hoisted(() => vi.fn(() => "req-access-test"));
const CAPTURE_APP_MESSAGE_MOCK = vi.hoisted(() => vi.fn(() => "req-access-message"));

vi.mock("@clerk/nextjs/server", () => ({ auth: (...args: unknown[]) => AUTH_MOCK(...args) }));

vi.mock("@/services/platform/integrations/sentry", () => ({
	captureAppException: CAPTURE_APP_EXCEPTION_MOCK,
	captureAppMessage: CAPTURE_APP_MESSAGE_MOCK,
}));

import {
	type AuthSession,
	getWorkspaceAccessToken,
	getWorkspaceAuthSession,
	isWorkspaceOperationFailure,
} from "./access";

describe("workspace access helpers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns the Clerk session when auth succeeds", async () => {
		const session = { getToken: vi.fn(), userId: "user-1" };
		AUTH_MOCK.mockResolvedValue(session);

		await expect(getWorkspaceAuthSession()).resolves.toBe(session);
	});

	it("maps auth failures to a service error", async () => {
		AUTH_MOCK.mockRejectedValue(new Error("clerk unavailable"));

		const result = await getWorkspaceAuthSession();

		expect(isWorkspaceOperationFailure(result)).toBe(true);
		expect(result).toMatchObject({ kind: "service", message: "Workspace authentication is unavailable." });
	});

	it("returns the Clerk data token when present", async () => {
		const session = {
			getToken: vi.fn().mockResolvedValue("jwt-token"),
			userId: "user-1",
		} as AuthSession;

		await expect(getWorkspaceAccessToken(session)).resolves.toBe("jwt-token");
	});

	it("maps a missing data token to a service error", async () => {
		const session = {
			getToken: vi.fn().mockResolvedValue(null),
			userId: "user-1",
		} as AuthSession;

		const result = await getWorkspaceAccessToken(session);

		expect(result).toMatchObject({ kind: "service", message: "Workspace data token is unavailable." });
	});
});
