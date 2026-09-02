// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeHeroSection } from "./HomeHeroSection";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("HomeHeroSection", () => {
	it("keeps the product story and navigation available when reduced motion is preferred", () => {
		vi.stubGlobal(
			"matchMedia",
			vi.fn((query: string) => ({
				addEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
				matches: query === "(prefers-reduced-motion: reduce)",
				media: query,
				onchange: null,
				removeEventListener: vi.fn(),
			})),
		);

		render(<HomeHeroSection />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
			"See what to collect, approve, or cut today.",
		);
		expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "/demo/workspace");
		expect(screen.getByRole("link", { name: "View Documentation" })).toHaveAttribute(
			"href",
			"https://cashlift-docs.vercel.app/",
		);
		expect(
			screen.getByRole("img", {
				name: "Studio Nova workspace with ranked cash actions, a 13-week cash outlook, and team budgets",
			}),
		).toBeInTheDocument();
	});
});
