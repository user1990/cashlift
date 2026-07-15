import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./MobileNav";

describe("MobileNav", () => {
	it("keeps account actions in the header and shows every navigation group when opened", async () => {
		const user = userEvent.setup();

		render(<MobileNav />);

		await user.click(screen.getByLabelText("Toggle navigation"));

		const featuresLink = screen.getByRole("link", { name: "Features" });
		expect(featuresLink).toBeVisible();
		expect(screen.getByRole("link", { name: "Software Services" })).toBeVisible();
		expect(screen.getByRole("link", { name: "Customers" })).toHaveAttribute("href", "/customers");
		expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "Sign up" })).not.toBeInTheDocument();
		expect(featuresLink).toHaveAttribute("href", "/features");
	});
});
