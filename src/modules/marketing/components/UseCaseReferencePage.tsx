import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { cn } from "@/ui/utils/cn";
import type { USE_CASES } from "../content";
import type { UseCaseReferenceDecision } from "../types";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";

type UseCaseReferencePageProps = {
	decisions: readonly UseCaseReferenceDecision[];
	useCase: (typeof USE_CASES)[keyof typeof USE_CASES];
	cardHref?: string;
	gridColumnsClassName?: string;
	showSignalRail?: boolean;
};

export const UseCaseReferencePage = ({
	decisions,
	useCase,
	cardHref,
	gridColumnsClassName = "lg:grid-cols-3",
	showSignalRail = false,
}: UseCaseReferencePageProps) => (
	<MainContent variant="marketing" className="relative overflow-hidden">
		<section className="relative isolate">
			<div aria-hidden className="absolute inset-x-0 top-0 h-px" />

			<div>
				<Hero description={useCase.description} label={useCase.label} variant="page-title" />

				<div className="relative mt-16 lg:mt-20 lg:pb-8">
					{showSignalRail && <UseCaseSignalRail />}

					<ol className={cn("relative mx-auto grid max-w-280 gap-6 lg:items-end lg:gap-12", gridColumnsClassName)}>
						{decisions.map((decision, index) => (
							<li
								key={decision.title}
								className={cn(
									"relative",
									index === 0 && "lg:translate-y-16",
									index === decisions.length - 1 && "lg:-translate-y-16",
								)}
							>
								<UseCaseDecisionCard cardHref={cardHref} decision={decision} />
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

function UseCaseSignalRail() {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-x-32 top-1/2 hidden lg:block">
			<span className="absolute inset-x-0 top-0 h-px -rotate-12 bg-primary shadow-primary-glow" />

			<span className="absolute top-14 left-[19%] size-5 rounded-full border-4 border-shell bg-primary shadow-primary-glow" />

			<span className="absolute top-2 left-1/2 size-5 -translate-x-1/2 rounded-full border-4 border-shell bg-highlight shadow-panel" />

			<span className="absolute -top-10 right-[18%] size-5 rounded-full border-4 border-shell bg-primary shadow-primary-glow" />
		</div>
	);
}

function UseCaseDecisionCard({
	cardHref,
	decision: { accentClassName, Icon, title },
}: {
	cardHref?: string;
	decision: UseCaseReferenceDecision;
}) {
	const card = (
		<article
			className={cn(
				"relative flex h-100 flex-col overflow-hidden rounded-[1.75rem] border border-shell-border bg-shell-elevated/70 p-5 text-shell-foreground shadow-shell backdrop-blur sm:p-6",
				cardHref &&
					"transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-primary-subtle-border group-hover:shadow-primary-glow motion-reduce:transition-none motion-reduce:group-hover:transform-none",
			)}
		>
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

			<h2 className="mt-7 text-center text-panel-foreground text-xl+">{title}</h2>
		</article>
	);

	if (!cardHref) {
		return card;
	}

	return (
		<Link
			aria-label={`Explore: ${title}`}
			href={cardHref}
			className="group block rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
		>
			{card}
		</Link>
	);
}
