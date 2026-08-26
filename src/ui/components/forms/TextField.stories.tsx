import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { TextField } from "@/ui/components/forms/TextField";

const meta = {
	args: {
		label: "Vendor name",
	},
	component: TextField,
	decorators: [
		(Story) => (
			<div className="w-80 rounded-lg border border-border bg-shell p-6 text-shell-foreground shadow-panel">
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

export const ErrorTransition: Story = {
	render: () => <ErrorTransitionDemo />,
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

function ErrorTransitionDemo() {
	const [invalid, setInvalid] = useState(false);
	const shouldReduceMotion = useReducedMotion();
	const sectionTransition = {
		duration: shouldReduceMotion ? 0 : 0.2,
		ease: "easeOut" as const,
	};

	return (
		<LazyMotion features={domAnimation}>
			<m.div className="grid w-full gap-3">
				<TextField
					errorMessage={invalid ? "Vendor name is required" : undefined}
					invalid={invalid}
					label="Vendor name"
					placeholder="Acme Studio"
				/>

				<m.button
					className="w-fit rounded-md border border-border bg-panel px-3 py-2 font-medium text-panel-foreground text-s outline-none transition-colors hover:border-primary hover:bg-panel-muted hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
					layout="position"
					onClick={() => setInvalid((isInvalid) => !isInvalid)}
					transition={sectionTransition}
					type="button"
				>
					{invalid ? "Clear error" : "Show error"}
				</m.button>
			</m.div>
		</LazyMotion>
	);
}
