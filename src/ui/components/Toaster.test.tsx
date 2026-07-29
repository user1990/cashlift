import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "@/ui/components/Toaster";

describe("Toaster", () => {
	it("exposes the shadcn Sonner slot", () => {
		render(<Toaster />);

		const slot = document.querySelector('[data-slot="sonner"]');

		expect(slot).toBeInTheDocument();
		expect(slot).toHaveClass("contents");
		expect(screen.getByRole("region")).toBeInTheDocument();
	});
});
