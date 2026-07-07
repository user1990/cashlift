"use client";

import type { ComponentProps } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { ControlledField, type ControlledFieldProps } from "@/ui/components/ControlledField";
import { TextField } from "@/ui/components/TextField";

type ControlledTextFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = ControlledFieldProps<TFieldValues, TName, ComponentProps<typeof TextField>>;

export const ControlledTextField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
	props: ControlledTextFieldProps<TFieldValues, TName>,
) => <ControlledField<TFieldValues, TName, ComponentProps<typeof TextField>> {...props} component={TextField} />;
