import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/ui/components/Badge";
import { ProgressBar } from "@/ui/components/ProgressBar";

const PROGRESS_STATES = [
	{ label: "Not started", value: 0, variant: "neutral" },
	{ label: "In progress", value: 42, variant: "primary" },
	{ label: "Complete", value: 100, variant: "success" },
	{ label: "Clamped low", value: -12, variant: "warning" },
	{ label: "Clamped high", value: 148, variant: "danger" },
] as const;

const meta = {
	args: {
		label: "Budget used",
		value: 42,
	},
	component: ProgressBar,
	decorators: [
		(Story) => (
			<div className="w-96">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
	title: "Feedback/ProgressBar",
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const Zero: Story = {
	args: {
		value: 0,
	},
};

export const Full: Story = {
	args: {
		value: 100,
	},
};

export const ClampedLow: Story = {
	args: {
		label: "Negative variance",
		value: -24,
	},
};

export const ClampedHigh: Story = {
	args: {
		label: "Over target",
		value: 132,
	},
};

export const States: Story = {
	render: () => (
		<div className="grid w-96 gap-4">
			{PROGRESS_STATES.map(({ label, value, variant }) => (
				<div className="space-y-2" key={label}>
					<Badge variant={variant}>{label}</Badge>

					<ProgressBar label={label} value={value} />
				</div>
			))}
		</div>
	),
};
