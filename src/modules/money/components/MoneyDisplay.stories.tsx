import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoneyDisplay } from "./MoneyDisplay";

const meta = {
	component: MoneyDisplay,
	title: "Money/MoneyDisplay",
} satisfies Meta<typeof MoneyDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Compact: Story = {
	args: {
		cents: 1_250_000,
	},
};

export const Exact: Story = {
	args: {
		cents: 1_250_000,
		exact: true,
	},
};

export const Warning: Story = {
	args: {
		cents: 42_500,
		exact: true,
		warning: true,
	},
};
