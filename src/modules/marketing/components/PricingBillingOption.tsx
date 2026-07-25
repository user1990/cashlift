"use client";

import type { ReactNode } from "react";
import { RadioButton, RadioField } from "react-aria-components";
import { cn } from "@/ui/utils/cn";
import type { PricingBilling } from "../content";

type PricingBillingOptionProps = {
	children: ReactNode;
	value: PricingBilling;
};

export const PricingBillingOption = ({ children, value }: PricingBillingOptionProps) => (
	<RadioField className="relative z-10 min-h-8" value={value}>
		<RadioButton
			className={cn(
				"flex min-h-8 cursor-pointer items-center justify-center rounded-full px-4 text-s font-semibold text-shell-muted outline-none transition-colors duration-150",
				"hover:text-shell-foreground data-hovered:text-shell-foreground",
				"data-selected:text-primary-foreground",
				"data-focus-visible:ring-[3px] data-focus-visible:ring-primary/25",
			)}
		>
			{children}
		</RadioButton>
	</RadioField>
);
