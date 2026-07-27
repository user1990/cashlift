import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "@/ui/components/Toaster";

describe("Toaster", () => {
	it("exposes the shadcn Sonner slot", () => {
		render(<Toaster />);

		expect(document.querySelector('[data-slot="sonner"]')).toBeInTheDocument();
		expect(screen.getByRole("region")).toBeInTheDocument();
	});
});
