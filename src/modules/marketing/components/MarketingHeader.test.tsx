import { render, screen } from "@testing-library/react";
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
});
