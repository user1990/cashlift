import { HomeDecisionStoryChapter } from "./HomeDecisionStoryChapter";

const DECISION_STORY_TITLE_ID = "decision-story-title";

const DECISION_CHAPTERS = [
	{
		chapter: "approve",
		description: "See the balance after the request, then decide with the cash impact in view.",
		eyebrow: "Approve spend",
		imageAlt: "Studio Nova approval queue showing the cash remaining after a hardware request",
		imageSrc: "/marketing/studio-nova-approvals.webp",
		title: "Know the cash impact before saying yes.",
	},
	{
		chapter: "recover",
		description: "Put the overdue invoice that threatens the buffer ahead of the rest of the queue.",
		eyebrow: "Recover cash",
		imageAlt: "Studio Nova invoice view highlighting overdue collection risk",
		imageSrc: "/marketing/studio-nova-invoices.webp",
		title: "Chase the invoice that protects the buffer.",
	},
	{
		chapter: "cut",
		description: "See low-use and duplicate subscriptions before their next renewal date.",
		eyebrow: "Cut waste",
		imageAlt: "Studio Nova vendor view showing low-use and duplicate subscriptions",
		imageSrc: "/marketing/studio-nova-vendors.webp",
		title: "Stop low-use renewals before they hit cash.",
	},
] as const;

export const HomeDecisionStorySection = () => (
	<section aria-labelledby={DECISION_STORY_TITLE_ID} className="border-shell-border border-b">
		<header className="mx-auto max-w-295 px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-20">
			<p className="font-semibold text-primary text-s+ uppercase tracking-normal">From inbox to decision</p>

			<h2
				id={DECISION_STORY_TITLE_ID}
				className="mt-3 max-w-3xl text-4xl+ text-shell-foreground tracking-normal sm:text-6xl+"
			>
				Three decisions. One daily view.
			</h2>
		</header>

		<div className="mx-auto max-w-295 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
			<ol className="space-y-16 lg:space-y-20">
				{DECISION_CHAPTERS.map(({ chapter, description, eyebrow, imageAlt, imageSrc, title }, index) => (
					<HomeDecisionStoryChapter
						key={chapter}
						chapter={chapter}
						description={description}
						eyebrow={eyebrow}
						imageAlt={imageAlt}
						imageSrc={imageSrc}
						index={index + 1}
						title={title}
					/>
				))}
			</ol>
		</div>
	</section>
);
