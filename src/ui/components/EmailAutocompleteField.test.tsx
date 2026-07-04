import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmailAutocompleteField } from "@/ui/components/EmailAutocompleteField";

describe("EmailAutocompleteField", () => {
	it("labels the input and reports value changes", async () => {
		const onChange = vi.fn();
		const { input, user } = setupEmailAutocomplete({
			onChange,
			placeholder: "maya@company.com…",
		});

		expect(input).toHaveAttribute("placeholder", "maya@company.com…");

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
		expect(screen.getByRole("option", { name: "ma@outlook.com" })).toBeInTheDocument();
	});

	it("fills the input when a suggestion is selected", async () => {
		const { input, user } = setupEmailAutocomplete();

		await user.type(input, "ma");
		await user.click(await screen.findByRole("option", { name: "ma@gmail.com" }));

		expect(input).toHaveValue("ma@gmail.com");
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

		await user.type(input, "ma");

		expect(await screen.findByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();

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

		await user.type(input, "ma");

		expect(await screen.findByRole("option", { name: "ma@gmail.com" })).toBeInTheDocument();

		await user.type(input, "@");

		expect(screen.queryByRole("option", { name: "ma@gmail.com" })).not.toBeInTheDocument();
	});

	it("shows validation errors", () => {
		render(<EmailAutocompleteField errorMessage="Enter a work email" invalid label="Work email" />);

		expect(screen.getByRole("combobox", { name: "Work email" })).toBeInvalid();
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
