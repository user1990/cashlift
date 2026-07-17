import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClerkSignInPasswordAutocomplete } from "./ClerkSignInPasswordAutocomplete";

describe("ClerkSignInPasswordAutocomplete", () => {
	it("adds password-manager semantics when Clerk mounts the sign-in password field", async () => {
		render(<ClerkSignInPasswordAutocomplete />);

		const passwordField = document.createElement("input");
		passwordField.id = "password-field";
		passwordField.name = "password";
		passwordField.type = "password";
		document.body.append(passwordField);

		await waitFor(() => {
			expect(passwordField).toHaveAttribute("autocomplete", "current-password");
		});
	});
});
