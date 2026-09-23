import Link from "next/link";
import { CashLiftLogo } from "@/ui/components/brand/CashLiftLogo";
import { cn } from "@/ui/utils/cn";

type LogoProps = {
	className?: string;
};

export const Logo = ({ className }: LogoProps) => (
	<Link aria-label="CashLift home" href="/" className={cn("shrink-0", className)}>
		<CashLiftLogo className="h-6 w-auto max-w-full shrink" />
	</Link>
);
