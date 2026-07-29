"use client";

import type { ComponentType } from "react";
import { type Control, Controller, type FieldPath, type FieldPathValue, type FieldValues } from "react-hook-form";

type FieldComponentProps = {
	errorMessage?: string;
	invalid?: boolean;
	name?: string;
	onBlur?: (...args: never[]) => void;
	onChange?: (value: string) => void;
	value?: string;
};

export type ControlledFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TProps extends FieldComponentProps,
> = Omit<TProps, "errorMessage" | "invalid" | "isInvalid" | "name" | "onBlur" | "onChange" | "value"> & {
	control: Control<TFieldValues>;
	name: TName;
	formatValue?: (value: FieldPathValue<TFieldValues, TName>) => string;
	parseValue?: (value: string) => FieldPathValue<TFieldValues, TName>;
};

type ControlledFieldBridgeProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TProps extends FieldComponentProps,
> = ControlledFieldProps<TFieldValues, TName, TProps> & {
	component: ComponentType<TProps>;
};

export const ControlledField = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TProps extends FieldComponentProps,
>({
	component: Component,
	control,
	formatValue,
	name,
	parseValue,
	...props
}: ControlledFieldBridgeProps<TFieldValues, TName, TProps>) => (
	<Controller
		control={control}
		name={name}
		render={({ field, fieldState }) => (
			<Component
				{...(props as unknown as TProps)}
				errorMessage={fieldState.error?.message}
				invalid={!!fieldState.error}
				onBlur={field.onBlur}
				onChange={(value) => field.onChange(parseValue ? parseValue(value) : value)}
				value={formatValue ? formatValue(field.value) : String(field.value ?? "")}
			/>
		)}
	/>
);
