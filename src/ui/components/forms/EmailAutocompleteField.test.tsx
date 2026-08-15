// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

describe("EmailAutocompleteField", () => {
	it("shows suggestions after two username characters and reports value changes", async () => {
		const onChange = vi.fn();
		const { input, user } = setupEmailAutocomplete({
			onChange,
		});

		await user.click(screen.getByText("Work email"));

		expect(input).toHaveFocus();

		await pasteValue(user, input, "m");

		expect(input).toHaveValue("m");
		expect(onChange).toHaveBeenLastCalledWith("m");

		expect(screen.queryByRole("option", { name: "m@gmail.com" })).not.toBeInTheDocument();

		await pasteValue(user, input, "a");

		expect(await screen.findByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "ma@outlook.com" })).toBeInTheDocument();
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

		await pasteValue(user, input, "y");

		expect(input).toHaveValue("may");
		expect(await screen.findByRole("option", { name: "may@gmail.com" })).toBeInTheDocument();
	});

	it("moves through suggestions with arrow keys", async () => {
		const { input, user } = setupEmailAutocomplete();

		await pasteValue(user, input, "ma");

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

		await pasteValue(user, input, "ma");
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

		await pasteValue(user, input, "y");

		const gmailOption = await screen.findByRole("option", { name: "may@gmail.com" });

		expect(gmailOption).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", gmailOption.id);
	});

	it("hides suggestions after an at sign", async () => {
		const { input, user } = setupEmailAutocomplete();

		await typeUsernameAndFindGmailOption(user, input);
		await pasteValue(user, input, "@");

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});
});

type ControlledEmailAutocompleteFieldProps = {
	onChange?: (value: string) => void;
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
	await pasteValue(user, input, "ma");

	return screen.findByRole("option", { name: "ma@gmail.com" });
}

async function pasteValue(user: ReturnType<typeof userEvent.setup>, input: HTMLElement, value: string) {
	await user.click(input);
	await user.paste(value);
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
