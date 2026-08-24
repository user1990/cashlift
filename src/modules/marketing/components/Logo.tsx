import Link from "next/link";
import { CashLiftLogo } from "@/ui/components/brand/CashLiftLogo";

export const Logo = () => (
	<Link aria-label="CashLift home" href="/" className="group shrink-0">
		<CashLiftLogo className="h-6 w-auto shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:scale-[0.97] group-focus-visible:-translate-y-px group-focus-visible:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none" />
	</Link>
);
