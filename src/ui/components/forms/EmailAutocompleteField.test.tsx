// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

describe("EmailAutocompleteField", () => {
	it("manages suggestions from typing and keyboard selection", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup({ delay: null });

		render(<ControlledEmailAutocompleteField onChange={onChange} />);

		const input = screen.getByRole("combobox", { name: "Work email" });

		await user.type(input, "m");

		expect(onChange).toHaveBeenLastCalledWith("m");
		expect(screen.queryByRole("option", { name: "m@gmail.com" })).not.toBeInTheDocument();

		await user.type(input, "a");

		expect(screen.getByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();

		await user.keyboard("{ArrowDown}{Enter}");

		expect(input).toHaveValue("ma@outlook.com");
		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});
});

type ControlledEmailAutocompleteFieldProps = {
	onChange?: (value: string) => void;
};

function ControlledEmailAutocompleteField({ onChange }: ControlledEmailAutocompleteFieldProps) {
	const [value, setValue] = useState("");

	return (
		<EmailAutocompleteField
			label="Work email"
			onChange={(nextValue) => {
				setValue(nextValue);
				onChange?.(nextValue);
			}}
			value={value}
		/>
	);
}
