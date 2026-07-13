import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderActions } from "./HeaderActions";

describe("HeaderActions", () => {
	it("links desktop and mobile visitors to the authentication routes", () => {
		render(<HeaderActions />);

		for (const link of screen.getAllByRole("link", { name: "Log in" })) {
			expect(link).toHaveAttribute("href", "/login");
		}

		for (const link of screen.getAllByRole("link", { name: "Sign up" })) {
			expect(link).toHaveAttribute("href", "/signup");
		}

		expect(screen.queryByRole("link", { name: "Run leak audit" })).not.toBeInTheDocument();
	});
});
