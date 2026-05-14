"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useId } from "react";
import { Radio, RadioGroup } from "react-aria-components";
import { cn } from "@/modules/ui/utils/cn";

type SegmentedControlProps<T extends string> = {
	label: string;
	onChange: (value: T) => void;
	options: Array<{ label: string; value: T }>;
	value: T;
};

export const SegmentedControl = <T extends string>({ label, onChange, options, value }: SegmentedControlProps<T>) => {
	const controlId = useId();
	const reducedMotion = useReducedMotion();

	return (
		<RadioGroup
			aria-label={label}
			className="inline-flex rounded-lg border border-border bg-panel-muted p-1"
			onChange={(nextValue) => onChange(nextValue as T)}
			value={value}
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
		</RadioGroup>
	);
};
