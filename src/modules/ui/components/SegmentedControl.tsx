"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useId } from "react";
import { RadioGroup as RACRadioGroup, Radio } from "react-aria-components";
import { cn } from "@/modules/ui/utils/cn";

type SegmentedControlOption<TValue extends string> = {
	label: string;
	value: TValue;
};

type SegmentedControlProps<TValue extends string> = {
	label: string;
	onChange: (value: TValue) => void;
	options: SegmentedControlOption<TValue>[];
	value: TValue;
};

export const SegmentedControl = <TValue extends string>({
	label,
	onChange,
	options,
	value,
}: SegmentedControlProps<TValue>) => {
	const controlId = useId();
	const reducedMotion = useReducedMotion();

	return (
		<RACRadioGroup
			aria-label={label}
			value={value}
			onChange={(nextValue) => {
				if (nextValue !== value) {
					onChange(nextValue as TValue);
				}
			}}
			className="inline-flex rounded-lg border border-border bg-panel-muted p-1"
		>
			{options.map(({ label: optionLabel, value: optionValue }) => (
				<Radio
					key={optionValue}
					className={({ isFocusVisible }) =>
						cn(
							"relative cursor-pointer overflow-hidden rounded-md px-3 py-1.5 text-s font-medium outline-none transition-colors duration-150 ease",
							isFocusVisible && "ring-[3px] ring-primary/20",
						)
					}
					value={optionValue}
				>
					{({ isSelected }) => (
						<>
							{isSelected && (
								<m.span
									className="absolute inset-0 rounded-md bg-panel shadow-sm"
									layoutId={`${controlId}-indicator`}
									transition={reducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeInOut", type: "tween" }}
								/>
							)}

							<span className={cn("relative z-10", isSelected ? "text-primary-strong" : "text-muted-foreground")}>
								{optionLabel}
							</span>
						</>
					)}
				</Radio>
			))}
		</RACRadioGroup>
	);
};
