import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthFormLoading } from "./AuthFormLoading";

describe("AuthFormLoading", () => {
	it.each([
		"Sign in to CashLift",
		"Create your CashLift account",
	])("shows an immediate authentication surface for %s", (title) => {
		render(<AuthFormLoading title={title} />);

		expect(screen.getByRole("status", { name: "Preparing authentication" })).toHaveAttribute("aria-busy", "true");
		expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
		expect(screen.getByText("Secure access to your company workspace")).toBeInTheDocument();
	});
});
