import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { PricingBilling } from "../content";
import { Logo } from "./Logo";

type CheckoutHeaderProps = {
	billing: PricingBilling;
};

export const CheckoutHeader = ({ billing }: CheckoutHeaderProps) => (
	<header className="border-shell-border border-b bg-shell/95">
		<div className="mx-auto flex min-w-0 max-w-295 items-center justify-between gap-2 px-4 py-5 sm:gap-4 sm:px-6 lg:px-8">
			<Link
				aria-label="Back to pricing"
				href={`/pricing?billing=${billing}`}
				className="focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-md font-medium text-shell-muted transition-colors duration-150 hover:text-primary"
			>
				<ArrowLeft aria-hidden className="size-5" />

				<span className="sr-only">Back to pricing</span>
			</Link>

			<Logo className="min-w-0 shrink" />

			<p className="inline-flex size-11 shrink-0 items-center justify-center font-medium text-m text-shell-muted">
				<ShieldCheck aria-hidden className="size-5 text-primary" />

				<span className="sr-only">Secure checkout</span>
			</p>
		</div>
	</header>
);
