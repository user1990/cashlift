"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { formatCurrency } from "@/modules/common/money/format";
import { AppButton } from "@/modules/ui/components/AppButton";
import { AppTextField } from "@/modules/ui/components/AppTextField";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { type QuickIncomeForm, quickIncomeSchema } from "../schemas";

export const QuickEntryPanel = () => {
	const form = useForm<QuickIncomeForm>({
		defaultValues: {
			amount: 75,
			label: "Marketplace sale",
		},
		resolver: zodResolver(quickIncomeSchema),
	});
	const preview = useWatch({ control: form.control, name: "amount" });

	return (
		<Panel>
			<PanelHeader eyebrow="Manual input" title="Log a quick cash lift" />

			<form
				className="space-y-3"
				onSubmit={form.handleSubmit(() => form.reset())}
			>
				<Controller
					control={form.control}
					name="label"
					render={({ field }) => (
						<AppTextField
							label="Source"
							onBlur={field.onBlur}
							onChange={field.onChange}
							placeholder="Overtime, resale, refund"
							value={field.value}
						/>
					)}
				/>

				<Controller
					control={form.control}
					name="amount"
					render={({ field }) => (
						<AppTextField
							inputMode="decimal"
							label="Amount"
							onBlur={field.onBlur}
							onChange={(value) => field.onChange(Number(value))}
							placeholder="75"
							value={String(field.value)}
						/>
					)}
				/>

				<div className="flex items-center justify-between gap-3 rounded-lg bg-[#FAFAFA] p-3 text-sm">
					<span className="text-[#6B6B6B]">Potential monthly lift</span>

					<span className="font-mono font-semibold">
						{formatCurrency((Number(preview) || 0) * 100)}
					</span>
				</div>

				<AppButton className="w-full" type="submit" variant="primary">
					Save manual entry
				</AppButton>
			</form>
		</Panel>
	);
};
