import { ShieldCheck, UsersRound } from "lucide-react";

export const PricingTrustNotes = () => (
	<div className="mt-8 grid gap-4 border-b border-shell-border pb-6 text-m text-shell-muted sm:grid-cols-2">
		<p className="flex items-center gap-3 sm:justify-end sm:border-r sm:border-shell-border sm:pr-8">
			<UsersRound aria-hidden className="size-6 shrink-0 text-primary" />
			Flat team pricing keeps request-only employees from adding seat anxiety.
		</p>

		<p className="flex items-center gap-3 sm:pl-4">
			<ShieldCheck aria-hidden className="size-6 shrink-0 text-signal" />
			Start with a free cash leak audit before choosing a paid plan.
		</p>
	</div>
);
