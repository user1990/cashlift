import Link from "next/link";
import { CashLiftLogo } from "@/ui/components/brand/CashLiftLogo";

export const Logo = () => (
	<Link aria-label="CashLift home" href="/" className="shrink-0">
		<CashLiftLogo className="h-10 w-[7.4rem] shrink-0 sm:w-[9.25rem]" />
	</Link>
);
