import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextField } from "@/ui/components/forms/TextField";

const meta = {
	args: {
		label: "Vendor name",
	},
	component: TextField,
	decorators: [
		(Story) => (
			<div className="w-80">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
	title: "Forms/TextField",
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
	args: {
		label: "Invoice number",
		placeholder: "INV-1042",
	},
};

export const Invalid: Story = {
	args: {
		errorMessage: "Vendor name is required",
		invalid: true,
		label: "Vendor name",
	},
};

export const Disabled: Story = {
	args: {
		isDisabled: true,
		label: "Vendor name",
		placeholder: "Acme Studio",
	},
};

export const ReadOnly: Story = {
	args: {
		isReadOnly: true,
		label: "Invoice number",
		value: "INV-1042",
	},
};

export const States: Story = {
	render: () => (
		<div className="grid w-2xl gap-4 sm:grid-cols-2">
			<TextField label="Default" placeholder="Acme Studio" />

			<TextField label="Disabled" isDisabled placeholder="Acme Studio" />

			<TextField label="Read only" isReadOnly value="INV-1042" />

			<TextField errorMessage="This field is required" invalid label="Invalid" placeholder="Missing value" />
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="grid w-2xl gap-4">
			<TextField className="max-w-64" label="Compact" placeholder="INV-1042" />

			<TextField className="max-w-80" label="Default width" placeholder="Acme Studio" />

			<TextField label="Full row" placeholder="Vendor payment description" />
		</div>
	),
};
