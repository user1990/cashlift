import { cn } from "@/ui/utils/cn";

type CashLiftLogoProps = {
	className?: string;
};

export const CashLiftLogo = ({ className }: CashLiftLogoProps) => (
	<svg
		aria-hidden="true"
		className={cn("h-auto w-full", className)}
		fill="none"
		viewBox="0 0 1200 406"
		xmlns="http://www.w3.org/2000/svg"
	>
		<text
			fill="#11c978"
			fontFamily="Arial Black, Arial, sans-serif"
			fontSize="220"
			fontWeight="900"
			letterSpacing="-10"
			x="32"
			y="278"
		>
			Cash
		</text>

		<path d="M378 54V352M398 54V352" stroke="#11c978" strokeWidth="8" />

		<text
			fill="#04c6ea"
			fontFamily="Arial Black, Arial, sans-serif"
			fontSize="220"
			fontWeight="900"
			letterSpacing="-10"
			x="655"
			y="278"
		>
			Lift
		</text>

		<path d="M659 321H995" stroke="#04c6ea" strokeWidth="20" />

		<path d="M963 321L1114 158L1130 173L979 337L963 337Z" fill="#04c6ea" />

		<path d="M1008 321L1141 180L1157 195L1024 337L1008 337Z" fill="#04c6ea" />

		<path d="M1075 168L1159 133L1148 224L1128 201L1110 222Z" fill="#04c6ea" />
	</svg>
);
