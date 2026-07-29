import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

const meta = {
	args: {
		label: "Work email",
		placeholder: "maya@company.com…",
	},
	component: EmailAutocompleteField,
	decorators: [
		(Story) => (
			<div className="size-80">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
	title: "Forms/EmailAutocompleteField",
} satisfies Meta<typeof EmailAutocompleteField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <EmailAutocompleteFieldDemo {...args} />,
};

export const Invalid: Story = {
	args: {
		errorMessage: "Enter a work email",
		invalid: true,
	},
	render: (args) => <EmailAutocompleteFieldDemo {...args} />,
};

function EmailAutocompleteFieldDemo(props: ComponentProps<typeof EmailAutocompleteField>) {
	const [value, setValue] = useState("");

	return <EmailAutocompleteField {...props} onChange={setValue} value={value} />;
}
