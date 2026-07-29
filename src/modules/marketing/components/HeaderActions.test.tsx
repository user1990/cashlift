// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderActions } from "./HeaderActions";

describe("HeaderActions", () => {
	it("keeps login and the public demo available to signed-out visitors", async () => {
		render(<HeaderActions />);

		const logInLinks = screen.getAllByRole("link", { name: "Log in" });
		expect(logInLinks).toHaveLength(1);

		for (const link of logInLinks) {
			expect(link).toHaveAttribute("href", "/login");
			expect(link).toHaveAttribute("target", "_top");
		}

		const demoLink = screen.getByRole("link", { name: "Open live demo" });
		expect(demoLink).toHaveAttribute("href", "/demo/workspace");
	});
});
