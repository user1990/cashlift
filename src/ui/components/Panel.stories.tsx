import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/ui/components/Button";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { ProgressBar } from "@/ui/components/ProgressBar";

const meta = {
	args: {
		as: "section",
		children: null,
		variant: "light",
	},
	component: Panel,
	parameters: {
		layout: "centered",
	},
	title: "UI/Panel",
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
	render: (args) => (
		<Panel {...args} className="w-96">
			<PanelHeader action={<Button variant="ghost">View</Button>} label="Cash control" title="Spend forecast" />

			<p className="text-m text-muted-foreground">Track committed spend before it becomes a cash-flow surprise.</p>
		</Panel>
	),
};

export const Glass: Story = {
	args: {
		variant: "glass",
	},
	render: (args) => (
		<Panel {...args} className="w-96">
			<PanelHeader label="Workspace" title="Approval queue" />

			<ProgressBar label="Reviewed requests" value={68} />
		</Panel>
	),
};

export const Accent: Story = {
	args: {
		variant: "accent",
	},
	render: (args) => (
		<Panel {...args} className="w-96">
			<PanelHeader label="Opportunity" title="Vendor savings" />

			<p className="text-m text-panel-foreground">Three contracts are ready for renewal review this month.</p>
		</Panel>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="grid w-3xl gap-4 md:grid-cols-3">
			<Panel>
				<PanelHeader label="Light" title="Baseline panel" />

				<p className="text-s text-muted-foreground">Default container for dense dashboard content.</p>
			</Panel>

			<Panel variant="glass">
				<PanelHeader label="Glass" title="Raised panel" />

				<p className="text-s text-muted-foreground">Used on shell surfaces that need extra separation.</p>
			</Panel>

			<Panel variant="accent">
				<PanelHeader label="Accent" title="Priority panel" />

				<p className="text-s text-panel-foreground">Highlights an actionable opportunity.</p>
			</Panel>
		</div>
	),
};

export const AsElements: Story = {
	render: () => (
		<div className="grid w-2xl gap-4 sm:grid-cols-3">
			<Panel as="div">
				<PanelHeader title="Div" />
			</Panel>

			<Panel as="section">
				<PanelHeader title="Section" />
			</Panel>

			<Panel as="article">
				<PanelHeader title="Article" />
			</Panel>
		</div>
	),
};
