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

		<path d="M378 66V300M398 66V300" stroke="#11c978" strokeWidth="8" />

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

		<path d="M970 337L1138 157" stroke="#04c6ea" strokeWidth="20" strokeLinecap="butt" />

		<path d="M1010 337L1178 157" stroke="#04c6ea" strokeWidth="20" strokeLinecap="butt" />

		<path d="M1075 168L1159 133L1148 224L1128 201L1110 222Z" fill="#04c6ea" />
	</svg>
);
