import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, Download, LoaderCircle, Plus, Trash2 } from "lucide-react";

import { Button } from "@/ui/components/Button";

const meta = {
	args: {
		children: "Review spend",
		variant: "secondary",
	},
	component: Button,
	parameters: {
		layout: "centered",
	},
	title: "Actions/Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: "Approve request",
		variant: "primary",
	},
};

export const Secondary: Story = {
	args: {
		children: "Open details",
		variant: "secondary",
	},
};

export const Success: Story = {
	args: {
		children: "Approve request",
		variant: "success",
	},
};

export const Ghost: Story = {
	args: {
		children: "Dismiss",
		variant: "ghost",
	},
};

export const Disabled: Story = {
	args: {
		children: "Processing",
		disabled: true,
		variant: "primary",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="primary">Primary</Button>

			<Button variant="secondary">Secondary</Button>

			<Button variant="success">Success</Button>

			<Button variant="ghost">Ghost</Button>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button size="small" variant="secondary">
				Small
			</Button>

			<Button variant="secondary">Default</Button>

			<Button size="large" variant="secondary">
				Large
			</Button>
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="primary">
				<Plus aria-hidden className="size-4" />
				New request
			</Button>

			<Button variant="secondary">
				<Download aria-hidden className="size-4" />
				Export
			</Button>

			<Button className="px-2.5" aria-label="Approve" variant="ghost">
				<Check aria-hidden className="size-4" />
			</Button>
		</div>
	),
};

export const Loading: Story = {
	args: {
		children: (
			<>
				<LoaderCircle aria-hidden className="size-4 animate-spin" />
				Saving
			</>
		),
		disabled: true,
		variant: "primary",
	},
};

export const DestructiveAction: Story = {
	args: {
		children: (
			<>
				<Trash2 aria-hidden className="size-4" />
				Reject request
			</>
		),
		variant: "secondary",
	},
};
