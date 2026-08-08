import type { HomeDecisionStoryAction } from "../types";
import { HomeDecisionStoryChapter } from "./HomeDecisionStoryChapter";

const DECISION_STORY_TITLE_ID = "decision-story-title";

type HomeDecisionStorySectionProps = {
	actions: HomeDecisionStoryAction[];
};

const DECISION_CHAPTERS = {
	approve: {
		imageAlt: "Studio Nova approval queue showing the cash remaining after a hardware request",
		imageSrc: "/marketing/studio-nova-approvals.webp",
	},
	collect: {
		imageAlt: "Studio Nova invoice view highlighting overdue collection risk",
		imageSrc: "/marketing/studio-nova-invoices.webp",
	},
	cut: {
		imageAlt: "Studio Nova vendor view showing low-use and duplicate subscriptions",
		imageSrc: "/marketing/studio-nova-vendors.webp",
	},
} as const;

export const HomeDecisionStorySection = ({ actions }: HomeDecisionStorySectionProps) => (
	<section aria-labelledby={DECISION_STORY_TITLE_ID} className="isolate border-shell-border border-b bg-shell">
		<header className="mx-auto max-w-4xl px-4 pt-14 pb-8 text-center sm:px-6 lg:px-8 lg:pt-16 lg:pb-10">
			<h2 id={DECISION_STORY_TITLE_ID} className="text-4xl+ text-primary tracking-normal sm:text-6xl+">
				Three decisions surfaced for today.
			</h2>
		</header>

		<div className="mx-auto max-w-295 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
			<ol className="[--decision-stick-gap:8svh] max-lg:space-y-8">
				{actions.flatMap((action, index) => {
					const chapter = DECISION_CHAPTERS[action.type];
					const last = index === actions.length - 1;
					const items = [
						<HomeDecisionStoryChapter
							key={action.type}
							action={action}
							imageAlt={chapter.imageAlt}
							imageSrc={chapter.imageSrc}
						/>,
					];

					if (!last) {
						items.push(
							<li
								key={`${action.type}-gap`}
								aria-hidden
								data-story-stick-gap="true"
								className="hidden h-(--decision-stick-gap) lg:list-item motion-reduce:lg:hidden"
							/>,
						);
					}

					return items;
				})}
			</ol>
		</div>
	</section>
);
