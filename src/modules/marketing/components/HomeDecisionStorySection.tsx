import type { HomeDecisionStoryAction } from "../types";
import { HomeDecisionStoryChapter } from "./HomeDecisionStoryChapter";

const DECISION_STORY_TITLE_ID = "decision-story-title";

type HomeDecisionStorySectionProps = {
	actions: HomeDecisionStoryAction[];
};

const DECISION_CHAPTERS = {
	approve: {
		imageAlt: "CashLift spend approvals dashboard showing a $380 Logitech request and cash after the next approval",
		imageSrc: "/marketing/studio-nova-approvals.webp",
	},
	collect: {
		imageAlt:
			"CashLift invoice dashboard showing $213,500 in overdue cash risk and Aurora Health as the priority collection",
		imageSrc: "/marketing/studio-nova-invoices.webp",
	},
	cut: {
		imageAlt: "CashLift vendor bills and leaks dashboard showing Notion as a $13,200 monthly vendor leak",
		imageSrc: "/marketing/studio-nova-vendors.webp",
	},
} as const;

const DECISION_STACKS = [
	{ offsetClassName: "lg:top-0", stackClassName: "lg:z-10" },
	{ offsetClassName: "lg:top-16", stackClassName: "lg:z-20" },
	{ offsetClassName: "lg:top-32", stackClassName: "lg:z-30" },
] as const;

export const HomeDecisionStorySection = ({ actions }: HomeDecisionStorySectionProps) => (
	<section aria-labelledby={DECISION_STORY_TITLE_ID} className="isolate border-shell-border border-b bg-shell">
		<header className="mx-auto max-w-4xl px-4 pt-14 pb-8 text-center sm:px-6 lg:px-8 lg:pt-16 lg:pb-10">
			<h2 id={DECISION_STORY_TITLE_ID} className="text-4xl+ text-primary tracking-normal sm:text-6xl+">
				Three decisions surfaced for today.
			</h2>
		</header>

		<div className="mx-auto max-w-295 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-40">
			<ol className="max-lg:space-y-8">
				{actions.map((action, index) => {
					const chapter = DECISION_CHAPTERS[action.type];
					const stack = DECISION_STACKS[index] ?? DECISION_STACKS[2];

					return (
						<HomeDecisionStoryChapter
							key={action.type}
							action={action}
							imageAlt={chapter.imageAlt}
							imageSrc={chapter.imageSrc}
							offsetClassName={stack.offsetClassName}
							stackIndex={Math.min(index, 2)}
							stackClassName={stack.stackClassName}
						/>
					);
				})}
			</ol>
		</div>
	</section>
);
