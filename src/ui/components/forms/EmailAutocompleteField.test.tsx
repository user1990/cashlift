// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

describe("EmailAutocompleteField", () => {
	it("shows suggestions after two username characters and reports value changes", async () => {
		const onChange = vi.fn();
		const { input, user } = setupEmailAutocomplete({ onChange });

		await user.click(screen.getByText("Work email"));

		expect(input).toHaveFocus();

		await user.type(input, "m");

		expect(input).toHaveValue("m");
		expect(onChange).toHaveBeenLastCalledWith("m");
		expect(screen.queryByRole("option", { name: "m@gmail.com" })).not.toBeInTheDocument();

		await user.type(input, "a");

		expect(input).toHaveValue("ma");
		expect(screen.getByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "ma@outlook.com" })).toBeInTheDocument();
	});

	it("closes suggestions when focus leaves the field", async () => {
		const user = userEvent.setup({ delay: null });

		render(
			<>
				<ControlledEmailAutocompleteField />

				<label>
					Company
					<input type="text" />
				</label>
			</>,
		);

		const input = screen.getByRole("combobox", { name: "Work email" });

		await user.type(input, "ma");
		expect(screen.getByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();

		await user.click(screen.getByRole("textbox", { name: "Company" }));

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});

	it("supports direct uncontrolled usage with a default value", async () => {
		const user = userEvent.setup({ delay: null });

		render(<EmailAutocompleteField defaultValue="ma" label="Work email" />);

		const input = screen.getByRole("combobox", { name: "Work email" });

		expect(input).toHaveValue("ma");

		await user.type(input, "y");

		expect(input).toHaveValue("may");
		expect(screen.getByRole("option", { name: "may@gmail.com" })).toBeInTheDocument();
	});

	it("navigates suggestions with the keyboard", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "ma");

		const gmailOption = screen.getByRole("option", { name: "ma@gmail.com" });
		const outlookOption = screen.getByRole("option", { name: "ma@outlook.com" });

		expect(gmailOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", gmailOption.id);

		await user.keyboard("{ArrowDown}");

		expect(outlookOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", outlookOption.id);

		await user.keyboard("{ArrowUp}{Escape}");

		expect(input).toHaveValue("ma");
		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
		expect(input).not.toHaveAttribute("aria-activedescendant");

		await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

		expect(input).toHaveValue("ma@outlook.com");

		await user.clear(input);
		await user.type(input, "ma{ArrowDown}y");

		const gmailMayOption = screen.getByRole("option", { name: "may@gmail.com" });

		expect(gmailMayOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", gmailMayOption.id);

		await user.clear(input);
		await user.type(input, "ma@");

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});
});

type ControlledEmailAutocompleteFieldProps = {
	onChange?: (value: string) => void;
};

function setupEmailAutocomplete(props: ControlledEmailAutocompleteFieldProps = {}) {
	const user = userEvent.setup({ delay: null });

	render(<ControlledEmailAutocompleteField {...props} />);

	return {
		input: screen.getByRole("combobox", { name: "Work email" }),
		user,
	};
}

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
