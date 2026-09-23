// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileNav } from "./MobileNav";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

describe("MobileNav", () => {
	it("traps focus in the open menu and closes on Escape", async () => {
		const user = userEvent.setup();

		render(
			<div>
				<MobileNav />

				<a href="/demo">Open live demo</a>
			</div>,
		);

		const toggle = screen.getByRole("button", { name: "Open navigation" });

		await user.click(toggle);

		const drawer = screen.getByRole("dialog", { name: "Mobile navigation" });

		expect(within(drawer).getByRole("link", { name: "Customers" })).toBeVisible();

		await user.keyboard("{Escape}");

		expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).not.toBeInTheDocument();
		expect(toggle).toHaveAttribute("aria-expanded", "false");
	});
});
