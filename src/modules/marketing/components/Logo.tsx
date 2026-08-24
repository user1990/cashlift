import Link from "next/link";
import { CashLiftLogo } from "@/ui/components/brand/CashLiftLogo";

export const Logo = () => (
	<Link aria-label="CashLift home" href="/" className="shrink-0">
		<CashLiftLogo className="h-6 w-auto shrink-0" />
	</Link>
);
