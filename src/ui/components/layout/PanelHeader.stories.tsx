import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/ui/components/actions/Button";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";

const meta = {
	args: {
		title: "Cash overview",
	},
	component: PanelHeader,
	decorators: [
		(Story) => (
			<Panel className="w-96">
				<Story />
			</Panel>
		),
	],
	parameters: {
		layout: "centered",
	},
	title: "Layout/PanelHeader",
} satisfies Meta<typeof PanelHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {};

export const WithLabel: Story = {
	args: {
		label: "Dashboard",
		title: "Cash overview",
	},
};

export const WithAction: Story = {
	args: {
		action: <Button variant="secondary">Export</Button>,
		label: "Reporting",
		title: "Monthly summary",
	},
};

export const LongTitle: Story = {
	args: {
		action: <Button variant="ghost">Open</Button>,
		label: "Renewal review",
		title: "Vendors with contract changes due this month",
	},
};

export const NarrowWithMetric: Story = {
	args: {
		action: (
			<div className="text-right">
				<p className="font-mono text-3xl+ text-panel-foreground">$2.48M</p>

				<p className="text-muted-foreground text-s">Ending cash balance</p>
			</div>
		),
		label: "13-week cash outlook",
		title: "Cash outlook from accounting-style data",
	},
	decorators: [
		(Story) => (
			<Panel className="w-80">
				<Story />
			</Panel>
		),
	],
};
