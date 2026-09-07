// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

describe("EmailAutocompleteField", () => {
	it("manages suggestions from typing and keyboard selection", () => {
		render(<ControlledEmailAutocompleteField />);

		const input = screen.getByRole("combobox", { name: "Work email" });

		fireEvent.change(input, { target: { value: "m" } });

		expect(screen.queryByRole("option", { name: "m@gmail.com" })).not.toBeInTheDocument();

		fireEvent.change(input, { target: { value: "ma" } });

		expect(screen.getByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();

		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(input).toHaveValue("ma@outlook.com");
	});

	it("does not commit a suggestion while an IME is composing", () => {
		render(<ControlledEmailAutocompleteField />);

		const input = screen.getByRole("combobox", { name: "Work email" });

		fireEvent.change(input, { target: { value: "ma" } });
		fireEvent.keyDown(input, { isComposing: true, key: "Enter" });

		expect(input).toHaveValue("ma");
	});
});

function ControlledEmailAutocompleteField() {
	const [value, setValue] = useState("");

	return <EmailAutocompleteField label="Work email" onChange={setValue} value={value} />;
}
