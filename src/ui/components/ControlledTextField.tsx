"use client";

import type { ComponentProps } from "react";
import { type Control, Controller, type FieldPath, type FieldPathValue, type FieldValues } from "react-hook-form";
import { TextField } from "@/ui/components/TextField";

type ControlledTextFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<
	ComponentProps<typeof TextField>,
	"errorMessage" | "invalid" | "isInvalid" | "name" | "onBlur" | "onChange" | "value"
> & {
	control: Control<TFieldValues>;
	name: TName;
	formatValue?: (value: FieldPathValue<TFieldValues, TName>) => string;
	parseValue?: (value: string) => FieldPathValue<TFieldValues, TName>;
};

export const ControlledTextField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
	control,
	formatValue,
	name,
	parseValue,
	...props
}: ControlledTextFieldProps<TFieldValues, TName>) => (
	<Controller
		control={control}
		name={name}
		render={({ field, fieldState }) => (
			<TextField
				{...props}
				errorMessage={fieldState.error?.message}
				invalid={Boolean(fieldState.error)}
				onBlur={field.onBlur}
				onChange={(value) => field.onChange(parseValue ? parseValue(value) : value)}
				value={formatValue ? formatValue(field.value) : String(field.value ?? "")}
			/>
		)}
	/>
);
