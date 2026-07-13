import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AuthError from "../error";
import AuthLoading from "../loading";

describe("authentication states", () => {
	it("announces the loading state", () => {
		render(<AuthLoading />);

		expect(screen.getByRole("status")).toHaveTextContent("Loading authentication");
		expect(screen.getByRole("heading", { name: "Loading authentication" })).toBeVisible();
	});

	it("offers a retry action for failures", async () => {
		const reset = vi.fn();
		const user = userEvent.setup();

		render(<AuthError error={new Error("Authentication failed")} reset={reset} />);

		expect(screen.getByRole("alert")).toHaveTextContent("Authentication unavailable");
		await user.click(screen.getByRole("button", { name: "Try again" }));
		expect(reset).toHaveBeenCalledOnce();
	});
});
