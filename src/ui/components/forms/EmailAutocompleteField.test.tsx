// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

describe("EmailAutocompleteField", () => {
	it("labels the input and reports value changes", async () => {
		const onChange = vi.fn();
		const { input, user } = setupEmailAutocomplete({
			onChange,
			placeholder: "maya@company.com…",
		});

		expect(input).toHaveAttribute("placeholder", "maya@company.com…");
		expect(input).toHaveAttribute("data-slot", "combobox-input");
		expect(input.closest('[data-slot="field"]')).toHaveAttribute("data-slot", "field");

		await user.type(input, "m");

		expect(input).toHaveValue("m");
		expect(onChange).toHaveBeenLastCalledWith("m");
	});

	it("shows suggestions after two username characters", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "m");

		expect(screen.queryByRole("option", { name: "m@gmail.com" })).not.toBeInTheDocument();

		await user.type(input, "a");

		expect(await screen.findByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "ma@gmail.com" })).toHaveAttribute("data-slot", "combobox-item");
		expect(screen.getByRole("listbox")).toHaveAttribute("data-slot", "combobox-list");
		expect(screen.getByRole("option", { name: "ma@outlook.com" })).toBeInTheDocument();
	});

	it("fills the input when a suggestion is selected", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "ma");
		await user.click(await screen.findByRole("option", { name: "ma@gmail.com" }));

		expect(input).toHaveValue("ma@gmail.com");
	});

	it("closes suggestions when focus leaves the field", async () => {
		const user = userEvent.setup();

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

		await typeUsernameAndFindGmailOption(user, input);
		await user.click(screen.getByRole("textbox", { name: "Company" }));

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});

	it("supports direct uncontrolled usage with a default value", async () => {
		const user = userEvent.setup();

		render(<EmailAutocompleteField defaultValue="ma" label="Work email" />);

		const input = screen.getByRole("combobox", { name: "Work email" });

		expect(input).toHaveValue("ma");

		await user.type(input, "y");

		expect(input).toHaveValue("may");
		expect(await screen.findByRole("option", { name: "may@gmail.com" })).toBeInTheDocument();
	});

	it("moves through suggestions with arrow keys", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "ma");

		const gmailOption = await screen.findByRole("option", { name: "ma@gmail.com" });
		const outlookOption = screen.getByRole("option", { name: "ma@outlook.com" });

		expect(gmailOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", gmailOption.id);

		await user.keyboard("{ArrowDown}");

		expect(outlookOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", outlookOption.id);

		await user.keyboard("{ArrowUp}");

		expect(gmailOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", gmailOption.id);
	});

	it("opens suggestions with arrow keys and selects the active suggestion with enter", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "ma");
		await user.keyboard("{Escape}");

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();

		await user.keyboard("{ArrowDown}");

		expect(await screen.findByRole("option", { name: "ma@gmail.com" })).toHaveAttribute("aria-selected", "true");

		await user.keyboard("{ArrowDown}");
		await user.keyboard("{Enter}");

		expect(input).toHaveValue("ma@outlook.com");
	});

	it("closes suggestions with escape without changing the input", async () => {
		const { input, user } = setupEmailAutocomplete();

		await typeUsernameAndFindGmailOption(user, input);
		await user.keyboard("{Escape}");

		expect(input).toHaveValue("ma");
		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
		expect(input).not.toHaveAttribute("aria-activedescendant");
	});

	it("resets the active suggestion when typing changes the suggestions", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "ma");
		await user.keyboard("{ArrowDown}");

		expect(screen.getByRole("option", { name: "ma@outlook.com" })).toHaveAttribute("aria-selected", "true");

		await user.type(input, "y");

		const gmailOption = await screen.findByRole("option", { name: "may@gmail.com" });

		expect(gmailOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", gmailOption.id);
	});

	it("hides suggestions after an at sign", async () => {
		const { input, user } = setupEmailAutocomplete();

		await typeUsernameAndFindGmailOption(user, input);
		await user.type(input, "@");

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});

	it("shows validation errors", () => {
		render(<EmailAutocompleteField errorMessage="Enter a work email" invalid label="Work email" />);

		expect(screen.getByRole("combobox", { name: "Work email" })).toBeInvalid();
		expect(screen.getByRole("combobox", { name: "Work email" }).closest('[data-slot="field"]')).toHaveAttribute(
			"data-invalid",
			"true",
		);
		expect(screen.getByText("Enter a work email")).toHaveAttribute("data-slot", "field-error");
		expect(screen.getByText("Enter a work email")).toBeInTheDocument();
	});
});

type ControlledEmailAutocompleteFieldProps = {
	onChange?: (value: string) => void;
	placeholder?: string;
};

function setupEmailAutocomplete(props: ControlledEmailAutocompleteFieldProps = {}) {
	const user = userEvent.setup();

	render(<ControlledEmailAutocompleteField {...props} />);

	return {
		input: screen.getByRole("combobox", { name: "Work email" }),
		user,
	};
}

async function typeUsernameAndFindGmailOption(user: ReturnType<typeof userEvent.setup>, input: HTMLElement) {
	await user.type(input, "ma");

	return screen.findByRole("option", { name: "ma@gmail.com" });
}

function ControlledEmailAutocompleteField({ onChange, placeholder }: ControlledEmailAutocompleteFieldProps) {
	const [value, setValue] = useState("");

	return (
		<EmailAutocompleteField
			label="Work email"
			onChange={(nextValue) => {
				setValue(nextValue);
				onChange?.(nextValue);
			}}
			placeholder={placeholder}
			value={value}
		/>
	);
}
