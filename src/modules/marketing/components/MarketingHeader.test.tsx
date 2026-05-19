import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImageProps } from "next/image";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { MarketingHeader } from "./MarketingHeader";

vi.mock("next/image", () => ({
	default: ({ alt, height, priority: _priority, src, width, ...props }: ImageProps) => {
		const imageSrc = typeof src === "string" ? src : "default" in src ? src.default.src : src.src;

		return createElement("img", { ...props, alt, height, src: imageSrc, width });
	},
}));

describe("MarketingHeader", () => {
	it("renders public navigation links without client state", () => {
		render(<MarketingHeader />);

		expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
		expect(screen.getAllByRole("link", { name: "Features" })).toHaveLength(2);
		expect(screen.getAllByRole("link", { name: "Pricing" })).toHaveLength(2);
		expect(screen.getAllByRole("link", { name: "Customers" })).toHaveLength(2);
		expect(screen.getAllByRole("link", { name: "Run leak audit" })).toHaveLength(2);
	});

	it("uses hover triggers on desktop and pressed disclosures on mobile nested groups", async () => {
		const user = userEvent.setup();

		render(<MarketingHeader />);

		expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-haspopup", "true");

		const productSummary = screen
			.getAllByText("Product")
			.find((element) => element.tagName.toLowerCase() === "summary");
		const productDetails = productSummary?.closest("details");

		if (!productSummary || !productDetails) {
			throw new Error("Expected mobile Product navigation group to render as a details disclosure");
		}

		expect(productDetails).not.toHaveAttribute("open");

		await user.click(productSummary);

		expect(productDetails).toHaveAttribute("open");
	});
});
