import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthGlassShell } from "./AuthGlassShell";

describe("AuthGlassShell", () => {
	it.each([
		{
			action: { href: "/signup", label: "Create account", prompt: "New to CashLift?" },
			accessibleName: "New to CashLift? Create account",
		},
		{
			action: { href: "/login", label: "Sign in", prompt: "Already have an account?" },
			accessibleName: "Already have an account? Sign in",
		},
	])("keeps $accessibleName discoverable without Clerk's footer", ({ accessibleName, action }) => {
		render(
			<AuthGlassShell action={action}>
				<div>Sign in form</div>
			</AuthGlassShell>,
		);

		expect(screen.getByRole("link", { name: accessibleName })).toHaveAttribute("href", action.href);
	});
});
