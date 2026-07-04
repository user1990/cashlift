"use client";

import type { ComponentProps } from "react";
import { type Control, Controller, type FieldPath, type FieldPathValue, type FieldValues } from "react-hook-form";
import { EmailAutocompleteField } from "@/ui/components/EmailAutocompleteField";

type ControlledEmailAutocompleteFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<
	ComponentProps<typeof EmailAutocompleteField>,
	"errorMessage" | "invalid" | "isInvalid" | "name" | "onBlur" | "onChange" | "value"
> & {
	control: Control<TFieldValues>;
	name: TName;
	formatValue?: (value: FieldPathValue<TFieldValues, TName>) => string;
	parseValue?: (value: string) => FieldPathValue<TFieldValues, TName>;
};

export const ControlledEmailAutocompleteField = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>({
	control,
	formatValue,
	name,
	parseValue,
	...props
}: ControlledEmailAutocompleteFieldProps<TFieldValues, TName>) => (
	<Controller
		control={control}
		name={name}
		render={({ field, fieldState }) => (
			<EmailAutocompleteField
				{...props}
				errorMessage={fieldState.error?.message}
				invalid={!!fieldState.error}
				onBlur={field.onBlur}
				onChange={(value) => field.onChange(parseValue ? parseValue(value) : value)}
				value={formatValue ? formatValue(field.value) : String(field.value ?? "")}
			/>
		)}
	/>
);
