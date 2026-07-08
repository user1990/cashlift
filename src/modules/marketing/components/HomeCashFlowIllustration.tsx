"use client";

import { ArrowRight, BanknoteArrowUp, CreditCard, FileClock, SearchCheck, ShieldCheck } from "lucide-react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/ui/utils/cn";

const INPUT_SIGNALS = [
	["Overdue invoice", "$18.4k", FileClock],
	["Vendor renewal", "$6.8k", SearchCheck],
	["Spend request", "$9.4k", CreditCard],
] as const;

const OUTPUT_ACTIONS = [
	["Collect", "Owner: Finance"],
	["Review", "Owner: Ops"],
	["Hold", "Owner: Manager"],
] as const;

export const HomeCashFlowIllustration = () => {
	const surfaceRef = useRef<HTMLDivElement>(null);
	const visible = useInView(surfaceRef, { amount: 0.35, once: true });

	return (
		<div
			ref={surfaceRef}
			className={cn(
				"cashflow-surface relative flex h-full min-h-[620px] flex-col overflow-hidden rounded-lg border border-shell-border bg-shell-elevated/75 p-5 shadow-shell",
				visible && "cashflow-visible",
			)}
		>
			<div
				aria-hidden
				className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgb(2_218_235/0.18),transparent_34%),radial-gradient(circle_at_72%_18%,rgb(220_22_147/0.14),transparent_28%)]"
			/>

			<div className="relative flex items-start justify-between gap-4">
				<div>
					<p className="text-s+ uppercase tracking-normal text-primary">Product motion</p>

					<h3 className="mt-2 text-3xl+ tracking-normal text-shell-foreground">From source signal to owned action.</h3>
				</div>

				<div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/15 text-primary shadow-primary-glow">
					<BanknoteArrowUp aria-hidden className="size-6" />
				</div>
			</div>

			<div className="relative mt-8 grid flex-1 items-stretch gap-5 lg:grid-cols-[1fr_0.7fr_1fr]">
				<SignalColumn items={INPUT_SIGNALS} title="Incoming signals" />

				<div className="cashflow-engine relative z-10 flex will-change-transform items-center justify-center">
					<div className="flex min-h-64 w-full flex-col justify-center rounded-lg border border-primary/45 bg-primary/10 p-4 text-center shadow-primary-glow">
						<div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
							<ShieldCheck aria-hidden className="size-7" />
						</div>

						<p className="mt-4 text-l+ text-shell-foreground">CashLift priority engine</p>

						<p className="mt-2 text-s leading-5 text-shell-muted">Ranks by runway, budget, due date, and owner.</p>
					</div>
				</div>

				<ActionColumn />

				<AnimatedRoutes />
			</div>
		</div>
	);
};

type SignalColumnProps = {
	items: typeof INPUT_SIGNALS;
	title: string;
};

const SignalColumn = ({ items, title }: SignalColumnProps) => (
	<div className="relative z-10 flex h-full flex-col justify-center">
		<p className="mb-3 text-s+ uppercase tracking-normal text-shell-muted">{title}</p>

		<ul className="grid gap-3">
			{items.map(([label, value, Icon]) => (
				<li
					key={label}
					className="cashflow-card rounded-lg border border-shell-border bg-white/10 p-3 will-change-transform"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-3">
							<Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />

							<div>
								<p className="text-m+ text-shell-foreground">{label}</p>

								<p className="mt-1 text-s text-shell-muted">Needs decision</p>
							</div>
						</div>

						<span className="font-mono text-m+ text-primary">{value}</span>
					</div>
				</li>
			))}
		</ul>
	</div>
);

const ActionColumn = () => (
	<div className="relative z-10 flex h-full flex-col justify-center">
		<p className="mb-3 text-s+ uppercase tracking-normal text-shell-muted">Team actions</p>

		<ul className="grid gap-3">
			{OUTPUT_ACTIONS.map(([label, owner]) => (
				<li
					key={label}
					className="cashflow-action group rounded-lg border border-shell-border bg-white/10 p-3 will-change-transform"
				>
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-m+ text-shell-foreground">{label}</p>

							<p className="mt-1 text-s text-shell-muted">{owner}</p>
						</div>

						<ArrowRight
							aria-hidden
							className="size-4 text-primary transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
						/>
					</div>
				</li>
			))}
		</ul>
	</div>
);

const AnimatedRoutes = () => (
	<svg
		aria-hidden
		className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
		fill="none"
		role="presentation"
		preserveAspectRatio="none"
		viewBox="0 0 720 560"
	>
		<path
			className="cashflow-route"
			d="M250 130 C300 130 300 280 335 280"
			pathLength="1"
			stroke="var(--primary)"
			strokeLinecap="round"
			strokeWidth="2"
		/>

		<path
			className="cashflow-route"
			d="M250 280 C295 280 300 280 335 280"
			pathLength="1"
			stroke="var(--primary)"
			strokeLinecap="round"
			strokeWidth="2"
		/>

		<path
			className="cashflow-route"
			d="M250 430 C300 430 300 280 335 280"
			pathLength="1"
			stroke="var(--primary)"
			strokeLinecap="round"
			strokeWidth="2"
		/>

		<path
			className="cashflow-route"
			d="M385 280 C430 280 430 130 470 130"
			pathLength="1"
			stroke="var(--highlight)"
			strokeLinecap="round"
			strokeWidth="2"
		/>

		<path
			className="cashflow-route"
			d="M385 280 C430 280 430 280 470 280"
			pathLength="1"
			stroke="var(--highlight)"
			strokeLinecap="round"
			strokeWidth="2"
		/>

		<path
			className="cashflow-route"
			d="M385 280 C430 280 430 430 470 430"
			pathLength="1"
			stroke="var(--highlight)"
			strokeLinecap="round"
			strokeWidth="2"
		/>
	</svg>
);
