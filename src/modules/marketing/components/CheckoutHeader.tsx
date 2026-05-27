import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Brand } from "./Brand";

export const CheckoutHeader = () => (
	<header className="border-b border-shell-border bg-shell/95">
		<div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
			<Link
				href="/pricing"
				className="inline-flex items-center gap-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary"
			>
				<ArrowLeft aria-hidden className="size-5" />

				<span className="hidden sm:inline">Back to pricing</span>

				<span className="sm:hidden">Pricing</span>
			</Link>

			<Brand />

			<p className="inline-flex items-center gap-2 text-m font-medium text-shell-muted">
				<ShieldCheck aria-hidden className="size-5 text-primary" />

				<span className="hidden sm:inline">Secure checkout</span>

				<span className="sm:hidden">Secure</span>
			</p>
		</div>
	</header>
);
