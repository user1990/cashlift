import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProgressBar } from "@/ui/components/ProgressBar";

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
			<ProgressBar label="Not started" value={0} />

			<ProgressBar label="In progress" value={42} />

			<ProgressBar label="Complete" value={100} />

			<ProgressBar label="Clamped low" value={-12} />

			<ProgressBar label="Clamped high" value={148} />
		</div>
	),
};
