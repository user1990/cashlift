import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderActions } from "./HeaderActions";

describe("HeaderActions", () => {
	it("links desktop and mobile visitors to the authentication routes", () => {
		render(<HeaderActions />);

		const logInLinks = screen.getAllByRole("link", { name: "Log in" });
		expect(logInLinks).toHaveLength(2);

		for (const link of logInLinks) {
			expect(link).toHaveAttribute("href", "/login");
			expect(link).toHaveAttribute("target", "_top");
		}

		const signUpLinks = screen.getAllByRole("link", { name: "Sign up" });
		expect(signUpLinks).toHaveLength(2);

		for (const link of signUpLinks) {
			expect(link).toHaveAttribute("href", "/signup");
			expect(link).toHaveAttribute("target", "_top");
		}

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
	});
});
