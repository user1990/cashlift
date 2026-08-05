import { cn } from "@/ui/utils/cn";
import type { HomeDecisionStoryAction } from "../types";
import { HomeDecisionStoryChapter } from "./HomeDecisionStoryChapter";

const DECISION_STORY_TITLE_ID = "decision-story-title";

type HomeDecisionStorySectionProps = {
	actions: HomeDecisionStoryAction[];
};

export const HomeDecisionStorySection = ({ actions }: HomeDecisionStorySectionProps) => (
	<section aria-labelledby={DECISION_STORY_TITLE_ID} className="isolate border-shell-border border-b bg-shell">
		<header className="mx-auto max-w-4xl px-4 pt-14 pb-8 text-center sm:px-6 lg:px-8 lg:pt-16 lg:pb-10">
			<h2 id={DECISION_STORY_TITLE_ID} className="text-5xl+ text-primary tracking-normal sm:text-7xl+">
				Three decisions surfaced for today.
			</h2>
		</header>

		<div className="mx-auto grid max-w-295 px-4 pb-20 sm:px-6 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pb-28">
			<DecisionProgress />

			<ol>
				{actions.map((action, index) => {
					const chapter = DECISION_CHAPTERS[action.type];

					return (
						<HomeDecisionStoryChapter
							key={action.type}
							action={action}
							context={chapter.context}
							imageAlt={chapter.imageAlt}
							imageSrc={chapter.imageSrc}
							index={index + 1}
						/>
					);
				})}
			</ol>
		</div>
	</section>
);

const DECISION_CHAPTERS = {
	approve: {
		context: "New spend affects the safe buffer.",
		imageAlt: "Studio Nova approval queue showing the cash remaining after a hardware request",
		imageSrc: "/marketing/studio-nova-approvals.webp",
	},
	collect: {
		context: "Invoice at risk before the next cash dip.",
		imageAlt: "Studio Nova invoice view highlighting overdue collection risk",
		imageSrc: "/marketing/studio-nova-invoices.webp",
	},
	cut: {
		context: "Low-use renewal bills again soon.",
		imageAlt: "Studio Nova vendor view showing low-use and duplicate subscriptions",
		imageSrc: "/marketing/studio-nova-vendors.webp",
	},
} as const;

function DecisionProgress() {
	return (
		<div aria-hidden className="relative hidden lg:block">
			<ol className="sticky top-28 grid h-112 content-between py-2 font-mono">
				{DECISION_PROGRESS_STEPS.map((label, index) => (
					<li key={label} className="relative grid grid-cols-[3rem_1fr] items-center gap-3">
						{index < DECISION_PROGRESS_STEPS.length - 1 && (
							<span className="absolute top-6 left-6 h-48 w-px bg-primary/60" />
						)}

						<span
							className={cn(
								"relative z-10 grid size-12 place-items-center rounded-full border font-semibold text-m",
								index === 0
									? "border-primary bg-primary text-shell shadow-[0_0_18px_color-mix(in_srgb,var(--primary)_60%,transparent)]"
									: "border-primary/60 bg-shell text-primary",
							)}
						>
							0{index + 1}
						</span>

						<span className="text-l text-shell-foreground">{label}</span>
					</li>
				))}
			</ol>
		</div>
	);
}

const DECISION_PROGRESS_STEPS = ["Collect", "Approve", "Cut"] as const;
