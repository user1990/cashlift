import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/ui/components/data/Badge";

const BADGE_VARIANTS = [
	{ label: "Neutral", variant: "neutral" },
	{ label: "Primary", variant: "primary" },
	{ label: "Success", variant: "success" },
	{ label: "Warning", variant: "warning" },
	{ label: "Danger", variant: "danger" },
	{ label: "Accent", variant: "accent" },
] as const;

const meta = {
	args: {
		children: "Pending",
		variant: "neutral",
	},
	component: Badge,
	parameters: {
		layout: "centered",
	},
	title: "Data/Badge",
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Primary: Story = {
	args: {
		children: "Cash control",
		variant: "primary",
	},
};

export const Success: Story = {
	args: {
		children: "Approved",
		variant: "success",
	},
};

export const Warning: Story = {
	args: {
		children: "Overdue",
		variant: "warning",
	},
};

export const Danger: Story = {
	args: {
		children: "Rejected",
		variant: "danger",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			{BADGE_VARIANTS.map(({ label, variant }) => (
				<Badge key={variant} variant={variant}>
					{label}
				</Badge>
			))}
		</div>
	),
};

export const WrappedLabel: Story = {
	args: {
		children: "13-week cash outlook",
		variant: "primary",
	},
	decorators: [
		(Story) => (
			<div className="w-36">
				<Story />
			</div>
		),
	],
};
