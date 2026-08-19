// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthGlassShell } from "./AuthGlassShell";

describe("AuthGlassShell", () => {
	it("keeps the signup action discoverable without Clerk's footer", () => {
		render(
			<AuthGlassShell action={{ href: "/signup", label: "Create account", prompt: "New to CashLift?" }}>
				<div>Sign in form</div>
			</AuthGlassShell>,
		);

		expect(screen.getByRole("link", { name: "New to CashLift? Create account" })).toHaveAttribute("href", "/signup");
	});
});
