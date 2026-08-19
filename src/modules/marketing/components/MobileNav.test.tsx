// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./MobileNav";

describe("MobileNav", () => {
	it("shows navigation groups when opened", async () => {
		const user = userEvent.setup({ delay: null });

		render(<MobileNav />);

		await user.click(screen.getByLabelText("Toggle navigation"));

		expect(screen.getByRole("link", { name: "Features" })).toBeVisible();
		expect(screen.getByRole("link", { name: "Customers" })).toHaveAttribute("href", "/customers");
		expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
	});
});
