"use client";

import type { ComponentProps } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { ControlledField, type ControlledFieldProps } from "@/ui/components/forms/ControlledField";
import { EmailAutocompleteField } from "@/ui/components/forms/EmailAutocompleteField";

type ControlledEmailAutocompleteFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = ControlledFieldProps<TFieldValues, TName, ComponentProps<typeof EmailAutocompleteField>>;

export const ControlledEmailAutocompleteField = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>(
	props: ControlledEmailAutocompleteFieldProps<TFieldValues, TName>,
) => (
	<ControlledField<TFieldValues, TName, ComponentProps<typeof EmailAutocompleteField>>
		{...props}
		component={EmailAutocompleteField}
	/>
);
