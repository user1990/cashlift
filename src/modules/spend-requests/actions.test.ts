import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	auth: vi.fn(),
	decideSpendRequest: vi.fn(),
	revalidatePath: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
	auth: mocks.auth,
}));

vi.mock("next/cache", () => ({
	revalidatePath: mocks.revalidatePath,
}));

vi.mock("./server", () => ({
	decideSpendRequest: mocks.decideSpendRequest,
}));

describe("decideSpendRequestAction", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		vi.stubEnv("CASHLIFT_APP_MODE", "production");
		mocks.auth.mockResolvedValue({ getToken: vi.fn(), userId: "user-1" });
	});

	it("revalidates workspace routes when the mutation persists", async () => {
		mocks.decideSpendRequest.mockResolvedValue({ refresh: true, status: "success" });
		const { decideSpendRequestAction } = await import("./actions");

		const result = await decideSpendRequestAction({ id: "request-brandforge", status: "approved" });

		expect(result).toEqual({ refresh: true, status: "success" });
		expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
		expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/approvals");
	});

	it("does not revalidate failed decisions", async () => {
		mocks.decideSpendRequest.mockResolvedValue({
			code: "unavailable",
			message: "Unable to update spend request.",
			status: "error",
		});
		const { decideSpendRequestAction } = await import("./actions");

		const result = await decideSpendRequestAction({ id: "request-brandforge", status: "approved" });

		expect(result).toEqual({
			code: "unavailable",
			message: "Unable to update spend request.",
			status: "error",
		});
		expect(mocks.revalidatePath).not.toHaveBeenCalled();
	});
});
