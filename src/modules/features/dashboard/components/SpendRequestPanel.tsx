"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { formatCurrency } from "@/modules/common/money/format";
import { Button } from "@/modules/ui/components/Button";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { TextField } from "@/modules/ui/components/TextField";
import { type SpendRequestForm, spendRequestSchema } from "../schemas";

export const SpendRequestPanel = () => {
	const form = useForm<SpendRequestForm>({
		defaultValues: {
			amount: 2_400,
			reason: "Client workshop travel before contract renewal",
			vendor: "Delta",
		},
		resolver: zodResolver(spendRequestSchema),
	});

	const { control, handleSubmit, reset } = form;

	const amount = useWatch({ control, name: "amount" });

	const submitForm = () => reset();

	return (
		<Panel>
			<PanelHeader eyebrow="Employee workflow" title="Request spend" />

			<form className="space-y-3" onSubmit={handleSubmit(submitForm)}>
				<Controller
					control={control}
					name="vendor"
					render={({ field, fieldState }) => (
						<TextField
							errorMessage={fieldState.error?.message}
							isInvalid={Boolean(fieldState.error)}
							label="Vendor"
							onBlur={field.onBlur}
							onChange={field.onChange}
							placeholder="Vendor"
							value={field.value}
						/>
					)}
				/>

				<Controller
					control={control}
					name="amount"
					render={({ field, fieldState }) => (
						<TextField
							errorMessage={fieldState.error?.message}
							inputMode="decimal"
							isInvalid={Boolean(fieldState.error)}
							label="Amount"
							onBlur={field.onBlur}
							onChange={(value) => field.onChange(Number(value))}
							placeholder="2400"
							value={String(field.value)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="reason"
					render={({ field, fieldState }) => (
						<TextField
							errorMessage={fieldState.error?.message}
							isInvalid={Boolean(fieldState.error)}
							label="Business reason"
							onBlur={field.onBlur}
							onChange={field.onChange}
							placeholder="What cash outcome does this support?"
							value={field.value}
						/>
					)}
				/>

				<div className="rounded-lg bg-panel-muted p-3 text-m">
					<div className="flex items-center justify-between gap-3">
						<span className="text-muted-foreground">Cash impact preview</span>

						<span className="font-mono text-m+">-{formatCurrency((Number(amount) || 0) * 100)}</span>
					</div>

					<p className="mt-2 text-s leading-5 text-muted-foreground">
						Manager sees budget, runway, and invoice timing before approving.
					</p>
				</div>

				<Button className="w-full" type="submit" variant="primary">
					Send request
				</Button>
			</form>
		</Panel>
	);
};
