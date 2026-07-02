import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/components/Button";
import { ControlledTextField } from "@/ui/components/ControlledTextField";

type DemoFormValues = {
	monthlyBudget: string;
};

const meta = {
	component: ControlledTextFieldDemo,
	parameters: {
		layout: "centered",
	},
	title: "Forms/ControlledTextField",
} satisfies Meta<typeof ControlledTextFieldDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithValidation: Story = {};

export const Filled: Story = {
	args: {
		defaultValue: "12500",
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: "12500",
		disabled: true,
	},
};

type ControlledTextFieldDemoProps = {
	defaultValue?: string;
	disabled?: boolean;
};

function ControlledTextFieldDemo({ defaultValue = "", disabled = false }: ControlledTextFieldDemoProps) {
	const { control, handleSubmit, setError } = useForm<DemoFormValues>({
		defaultValues: {
			monthlyBudget: defaultValue,
		},
		mode: "onBlur",
	});

	useEffect(() => {
		if (defaultValue) {
			return;
		}

		setError("monthlyBudget", {
			message: "Enter a budget amount",
			type: "required",
		});
	}, [defaultValue, setError]);

	return (
		<form className="w-80 space-y-4" onSubmit={handleSubmit(() => undefined)}>
			<ControlledTextField control={control} label="Monthly budget" name="monthlyBudget" placeholder="12000" />

			<Button disabled={disabled} type="submit" variant="primary">
				Save budget
			</Button>
		</form>
	);
}
