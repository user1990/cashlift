"use client";

import { useId, useState } from "react";
import { Input, TextField as RACTextField, type TextFieldProps as RACTextFieldProps } from "react-aria-components";
import { FieldErrorMessage } from "@/ui/components/forms/FieldErrorMessage";
import { cn } from "@/ui/utils/cn";

const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "yahoo.com", "proton.me", "hotmail.com"];

type EmailSuggestion = {
	id: string;
	value: string;
};

type EmailAutocompleteFieldProps = Omit<RACTextFieldProps, "className" | "onChange"> & {
	label: string;
	className?: string;
	errorMessage?: string;
	invalid?: boolean;
	onChange?: (value: string) => void;
	placeholder?: string;
	value?: string;
};

export const EmailAutocompleteField = ({
	defaultValue,
	errorMessage,
	id,
	invalid,
	label,
	onChange,
	placeholder,
	value,
	className,
	...props
}: EmailAutocompleteFieldProps) => {
	const generatedFieldId = useId();
	const fieldId = id ?? generatedFieldId;
	const listboxId = useId();
	const optionIdPrefix = useId();
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(null);
	const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ""));
	const [open, setOpen] = useState(false);
	const fieldValue = value ?? uncontrolledValue;
	const suggestions = getEmailSuggestions(fieldValue);
	const openSuggestions = open && suggestions.length > 0;
	const activeSuggestion = activeSuggestionIndex === null ? null : suggestions[activeSuggestionIndex];

	const closeSuggestions = () => {
		setOpen(false);
		setActiveSuggestionIndex(null);
	};

	const updateValue = (nextValue: string) => {
		const nextSuggestions = getEmailSuggestions(nextValue);

		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}

		onChange?.(nextValue);
		setOpen(nextSuggestions.length > 0);
		setActiveSuggestionIndex(nextSuggestions.length > 0 ? 0 : null);
	};

	const selectSuggestion = (suggestion: string) => {
		if (value === undefined) {
			setUncontrolledValue(suggestion);
		}

		onChange?.(suggestion);
		closeSuggestions();
	};

	return (
		<RACTextField
			aria-label={label}
			isInvalid={invalid}
			className={cn(
				"relative space-y-1.5 [&:has(input[data-invalid])_input]:border-red-400 [&:has(input[data-invalid])_input]:transition-none [&:has(input[data-invalid])_input]:focus:border-red-400 [&:has(input[data-invalid])_input]:focus:ring-red-400/20",
				className,
			)}
			data-invalid={invalid || undefined}
			data-slot="field"
			defaultValue={defaultValue}
			id={fieldId}
			onChange={updateValue}
			value={value}
			{...props}
		>
			<label className="font-medium text-panel-foreground text-s" data-slot="field-label" htmlFor={fieldId}>
				{label}
			</label>

			<Input
				aria-activedescendant={
					openSuggestions && activeSuggestion ? getOptionId(optionIdPrefix, activeSuggestion.id) : undefined
				}
				aria-controls={openSuggestions ? listboxId : undefined}
				aria-expanded={openSuggestions}
				autoComplete="email"
				inputMode="email"
				onKeyDown={(event) => {
					if (event.key === "ArrowDown") {
						event.preventDefault();
						setOpen(suggestions.length > 0);
						setActiveSuggestionIndex((index) => getNextIndex(index, suggestions.length));
						return;
					}

					if (event.key === "ArrowUp") {
						event.preventDefault();
						setOpen(suggestions.length > 0);
						setActiveSuggestionIndex((index) => getPreviousIndex(index, suggestions.length));
						return;
					}

					if (event.key === "Enter" && openSuggestions) {
						event.preventDefault();
						selectSuggestion((activeSuggestion ?? suggestions[0]).value);
						return;
					}

					if (event.key === "Escape") {
						closeSuggestions();
					}
				}}
				onBlur={(event) => {
					if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
						closeSuggestions();
					}
				}}
				placeholder={placeholder}
				role="combobox"
				data-slot="combobox-input"
				type="email"
				className="ease h-10 w-full rounded-md border border-border bg-panel px-3 text-m text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20"
			/>

			{openSuggestions && (
				<div
					className="absolute z-20 mt-1 w-full rounded-md border border-border bg-panel p-1 shadow-lg"
					data-slot="combobox-list"
					id={listboxId}
					role="listbox"
				>
					{suggestions.map(({ id, value: suggestion }, index) => (
						<button
							aria-selected={index === activeSuggestionIndex}
							className={cn(
								"block w-full rounded px-2.5 py-2 text-left text-m text-panel-foreground outline-none transition-colors hover:bg-primary/10 focus:bg-primary/10",
								index === activeSuggestionIndex && "bg-primary/10",
							)}
							id={getOptionId(optionIdPrefix, id)}
							key={id}
							onClick={() => selectSuggestion(suggestion)}
							onMouseDown={(event) => event.preventDefault()}
							role="option"
							data-slot="combobox-item"
							tabIndex={-1}
							type="button"
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			<FieldErrorMessage errorMessage={errorMessage} />
		</RACTextField>
	);
};

function getNextIndex(index: number | null, suggestionCount: number): number | null {
	if (suggestionCount === 0) {
		return null;
	}

	return index === null ? 0 : (index + 1) % suggestionCount;
}

function getPreviousIndex(index: number | null, suggestionCount: number): number | null {
	if (suggestionCount === 0) {
		return null;
	}

	return index === null ? suggestionCount - 1 : (index - 1 + suggestionCount) % suggestionCount;
}

function getEmailSuggestions(value: string): EmailSuggestion[] {
	const username = value.trim();

	if (username.length < 2 || username.includes("@")) {
		return [];
	}

	return EMAIL_DOMAINS.map((domain) => {
		const suggestion = `${username}@${domain}`;

		return {
			id: suggestion,
			value: suggestion,
		};
	});
}

function getOptionId(prefix: string, suggestionId: string): string {
	return `${prefix}-${suggestionId}`;
}
