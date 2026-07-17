import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthGlassShell } from "./AuthGlassShell";

describe("AuthGlassShell", () => {
	it("keeps account creation discoverable without Clerk's footer", () => {
		render(
			<AuthGlassShell signUpHref="/signup">
				<div>Sign in form</div>
			</AuthGlassShell>,
		);

		expect(screen.getByRole("link", { name: "New to CashLift? Create account" })).toHaveAttribute("href", "/signup");
	});
});
