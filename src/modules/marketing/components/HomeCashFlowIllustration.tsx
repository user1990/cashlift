"use client";

import { ArrowRight, BanknoteArrowUp, CreditCard, FileClock, SearchCheck, ShieldCheck } from "lucide-react";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

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

const CARD_ANIMATION = {
	hidden: { opacity: 0, transform: "translateY(14px)" },
	visible: { opacity: 1, transform: "translateY(0)" },
} as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const HomeCashFlowIllustration = () => {
	const reducedMotion = useReducedMotion();

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className="relative flex h-full min-h-[620px] flex-col overflow-hidden rounded-lg border border-shell-border bg-shell-elevated/75 p-5 shadow-shell"
				initial={reducedMotion ? "visible" : "hidden"}
				viewport={{ amount: 0.35, once: true }}
				whileInView="visible"
			>
				<div
					aria-hidden
					className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgb(2_218_235/0.18),transparent_34%),radial-gradient(circle_at_72%_18%,rgb(220_22_147/0.14),transparent_28%)]"
				/>

				<div className="relative flex items-start justify-between gap-4">
					<div>
						<p className="text-s+ uppercase tracking-normal text-primary">Product motion</p>

						<h3 className="mt-2 text-3xl+ tracking-normal text-shell-foreground">
							From source signal to owned action.
						</h3>
					</div>

					<div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/15 text-primary shadow-primary-glow">
						<BanknoteArrowUp aria-hidden className="size-6" />
					</div>
				</div>

				<div className="relative mt-8 grid flex-1 items-stretch gap-5 lg:grid-cols-[1fr_0.7fr_1fr]">
					<SignalColumn delay={0.05} items={INPUT_SIGNALS} reducedMotion={reducedMotion} title="Incoming signals" />

					<m.div
						className="relative z-10 flex will-change-transform items-center justify-center"
						variants={{
							hidden: { opacity: 0, transform: "scale(0.96) translateY(12px)" },
							visible: { opacity: 1, transform: "scale(1) translateY(0)" },
						}}
						transition={getTransition({ delay: 0.28, duration: 0.45, reducedMotion })}
					>
						<div className="flex min-h-64 w-full flex-col justify-center rounded-lg border border-primary/45 bg-primary/10 p-4 text-center shadow-primary-glow">
							<div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
								<ShieldCheck aria-hidden className="size-7" />
							</div>

							<p className="mt-4 text-l+ text-shell-foreground">Kuvro priority engine</p>

							<p className="mt-2 text-s leading-5 text-shell-muted">Ranks by runway, budget, due date, and owner.</p>
						</div>
					</m.div>

					<ActionColumn reducedMotion={reducedMotion} />

					<AnimatedRoutes reducedMotion={reducedMotion} />
				</div>
			</m.div>
		</LazyMotion>
	);
};

type SignalColumnProps = {
	delay: number;
	items: typeof INPUT_SIGNALS;
	reducedMotion: boolean | null;
	title: string;
};

const SignalColumn = ({ delay, items, reducedMotion, title }: SignalColumnProps) => (
	<div className="relative z-10 flex h-full flex-col justify-center">
		<p className="mb-3 text-s+ uppercase tracking-normal text-shell-muted">{title}</p>

		<ul className="grid gap-3">
			{items.map(([label, value, Icon], index) => (
				<m.li
					key={label}
					className="rounded-lg border border-shell-border bg-white/10 p-3 will-change-transform"
					variants={CARD_ANIMATION}
					transition={getTransition({ delay: delay + index * 0.08, duration: 0.35, reducedMotion })}
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
				</m.li>
			))}
		</ul>
	</div>
);

type ActionColumnProps = {
	reducedMotion: boolean | null;
};

const ActionColumn = ({ reducedMotion }: ActionColumnProps) => (
	<div className="relative z-10 flex h-full flex-col justify-center">
		<p className="mb-3 text-s+ uppercase tracking-normal text-shell-muted">Team actions</p>

		<ul className="grid gap-3">
			{OUTPUT_ACTIONS.map(([label, owner], index) => (
				<m.li
					key={label}
					className="group rounded-lg border border-shell-border bg-white/10 p-3 will-change-transform"
					variants={{
						hidden: { opacity: 0, transform: "translateX(18px)" },
						visible: { opacity: 1, transform: "translateX(0)" },
					}}
					transition={getTransition({ delay: 0.45 + index * 0.09, duration: 0.35, reducedMotion })}
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
				</m.li>
			))}
		</ul>
	</div>
);

type AnimatedRoutesProps = {
	reducedMotion: boolean | null;
};

const AnimatedRoutes = ({ reducedMotion }: AnimatedRoutesProps) => (
	<svg
		aria-hidden
		className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
		fill="none"
		role="presentation"
		preserveAspectRatio="none"
		viewBox="0 0 720 560"
	>
		<m.path
			d="M250 130 C300 130 300 280 335 280"
			stroke="var(--primary)"
			strokeLinecap="round"
			strokeWidth="2"
			variants={routeVariants(0.3, reducedMotion)}
		/>

		<m.path
			d="M250 280 C295 280 300 280 335 280"
			stroke="var(--primary)"
			strokeLinecap="round"
			strokeWidth="2"
			variants={routeVariants(0.4, reducedMotion)}
		/>

		<m.path
			d="M250 430 C300 430 300 280 335 280"
			stroke="var(--primary)"
			strokeLinecap="round"
			strokeWidth="2"
			variants={routeVariants(0.5, reducedMotion)}
		/>

		<m.path
			d="M385 280 C430 280 430 130 470 130"
			stroke="var(--highlight)"
			strokeLinecap="round"
			strokeWidth="2"
			variants={routeVariants(0.62, reducedMotion)}
		/>

		<m.path
			d="M385 280 C430 280 430 280 470 280"
			stroke="var(--highlight)"
			strokeLinecap="round"
			strokeWidth="2"
			variants={routeVariants(0.72, reducedMotion)}
		/>

		<m.path
			d="M385 280 C430 280 430 430 470 430"
			stroke="var(--highlight)"
			strokeLinecap="round"
			strokeWidth="2"
			variants={routeVariants(0.82, reducedMotion)}
		/>
	</svg>
);

type TransitionOptions = {
	delay: number;
	duration: number;
	reducedMotion: boolean | null;
};

function getTransition({ delay, duration, reducedMotion }: TransitionOptions) {
	return {
		delay: reducedMotion ? 0 : delay,
		duration: reducedMotion ? 0 : duration,
		ease: EASE_OUT,
	};
}

function routeVariants(delay: number, reducedMotion: boolean | null) {
	return {
		hidden: { opacity: 0, pathLength: 0 },
		visible: {
			opacity: 0.82,
			pathLength: 1,
			transition: getTransition({ delay, duration: 0.45, reducedMotion }),
		},
	};
}
