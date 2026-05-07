"use client";

import { Radio, RadioGroup } from "react-aria-components";
import { cn } from "@/modules/ui/utils/cn";

type SegmentedControlProps<T extends string> = {
	label: string;
	onChange: (value: T) => void;
	options: Array<{ label: string; value: T }>;
	value: T;
};

export const SegmentedControl = <T extends string>({
	label,
	onChange,
	options,
	value,
}: SegmentedControlProps<T>) => {
	return (
		<RadioGroup
			aria-label={label}
			className="inline-flex rounded-lg border border-[#E8E8EC] bg-[#F7F7F8] p-1"
			onChange={(nextValue) => onChange(nextValue as T)}
			value={value}
		>
			{options.map((option) => (
				<Radio
					className={({ isFocusVisible, isSelected }) =>
						cn(
							"cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium text-[#6B6B6B] outline-none transition-[background-color,color,box-shadow] duration-150 ease-out",
							isSelected && "bg-white text-indigo-700 shadow-sm",
							isFocusVisible && "ring-[3px] ring-indigo-500/15",
						)
					}
					key={option.value}
					value={option.value}
				>
					{option.label}
				</Radio>
			))}
		</RadioGroup>
	);
};
