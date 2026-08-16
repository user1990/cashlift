import { BellRing, type LucideIcon, Plane, UsersRound } from "lucide-react";
import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { cn } from "@/ui/utils/cn";
import type { USE_CASES } from "../content";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";

type ConsultingReferencePageProps = {
	useCase: (typeof USE_CASES)["consulting"];
};

export const ConsultingReferencePage = ({ useCase }: ConsultingReferencePageProps) => (
	<MainContent variant="marketing" className="relative overflow-hidden">
		<section className="relative isolate">
			<div aria-hidden className="absolute inset-x-0 top-0 h-px" />

			<div>
				<Hero description={useCase.description} label={useCase.label} variant="page-title" />

				<div className="relative mt-16 lg:mt-20 lg:pb-8">
					<ConsultingSignalRail />

					<ol className="relative mx-auto grid max-w-280 gap-6 md:grid-cols-3 md:items-end lg:gap-12">
						{CONSULTING_DECISIONS.map((decision, index) => (
							<li
								key={decision.title}
								className={cn("relative", index === 0 && "lg:translate-y-16", index === 2 && "lg:-translate-y-16")}
							>
								<ConsultingDecisionCard decision={decision} />
							</li>
						))}
					</ol>
				</div>

				<div className="mt-12 flex justify-center lg:mt-4">
					<ActionLink href="/demo">Run use-case demo</ActionLink>
				</div>
			</div>
		</section>
	</MainContent>
);

type ConsultingDecision = {
	accentClassName: string;
	Icon: LucideIcon;
	title: string;
};

const CONSULTING_DECISIONS = [
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: Plane,
		title: "Can we book travel for the workshop without dipping under buffer?",
	},
	{
		accentClassName: "border-highlight-muted bg-highlight-subtle text-highlight",
		Icon: BellRing,
		title: "Which retainer needs a collection nudge today?",
	},
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: UsersRound,
		title: "Which team has budget room for a contractor?",
	},
] as const satisfies readonly ConsultingDecision[];

function ConsultingSignalRail() {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-x-32 top-1/2 hidden lg:block">
			<span className="absolute inset-x-0 top-0 h-px -rotate-12 bg-primary shadow-primary-glow" />

			<span className="absolute top-14 left-[19%] size-5 rounded-full border-4 border-shell bg-primary shadow-primary-glow" />

			<span className="absolute top-2 left-1/2 size-5 -translate-x-1/2 rounded-full border-4 border-shell bg-highlight shadow-panel" />

			<span className="absolute -top-10 right-[18%] size-5 rounded-full border-4 border-shell bg-primary shadow-primary-glow" />
		</div>
	);
}

function ConsultingDecisionCard({ decision: { accentClassName, Icon, title } }: { decision: ConsultingDecision }) {
	return (
		<Link
			aria-label={`Explore: ${title}`}
			href="/demo"
			className="group block rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
		>
			<article className="relative flex h-124 flex-col overflow-hidden rounded-[1.75rem] border border-shell-border bg-panel p-5 shadow-shell transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-1 group-hover:border-primary-subtle-border group-hover:shadow-primary-glow motion-reduce:group-hover:transform-none sm:p-6">
				<div className="relative flex h-56 shrink-0 items-center justify-center rounded-2xl border border-border bg-shell-elevated p-5 shadow-panel">
					<span
						aria-hidden
						className="absolute top-4 left-4 size-2 rounded-full border border-muted-foreground/60 bg-shell"
					/>

					<span
						aria-hidden
						className="absolute top-4 right-4 size-2 rounded-full border border-muted-foreground/60 bg-shell"
					/>

					<span
						aria-hidden
						className="absolute bottom-4 left-4 size-2 rounded-full border border-muted-foreground/60 bg-shell"
					/>

					<span
						aria-hidden
						className="absolute right-4 bottom-4 size-2 rounded-full border border-muted-foreground/60 bg-shell"
					/>

					<div className="flex size-36 items-center justify-center rounded-[1.6rem] border border-border bg-shell p-3 shadow-shell">
						<div
							className={cn(
								"flex size-full items-center justify-center rounded-2xl border shadow-panel",
								accentClassName,
							)}
						>
							<Icon aria-hidden strokeWidth={1.25} className="size-16" />
						</div>
					</div>
				</div>

				<h2 className="mt-7 text-panel-foreground text-xl+">{title}</h2>

				<div aria-hidden className="mt-auto pt-8">
					<span className="block h-px w-full bg-border" />

					<span className="mt-4 block h-px w-4/5 bg-primary/80" />
				</div>
			</article>
		</Link>
	);
}
