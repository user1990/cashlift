import { HomeDecisionStoryChapter } from "./HomeDecisionStoryChapter";

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
	<section aria-labelledby="decision-story-title" className="border-b border-shell-border">
		<header className="mx-auto max-w-295 px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
			<p className="text-s+ font-semibold uppercase tracking-normal text-primary">From inbox to decision</p>

			<h2
				id="decision-story-title"
				className="mt-3 max-w-3xl text-4xl+ tracking-normal text-shell-foreground sm:text-6xl+"
			>
				Three decisions. One daily view.
			</h2>
		</header>

		<div className="mx-auto max-w-295 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
			<ol className="space-y-16 lg:space-y-20">
				{DECISION_CHAPTERS.map((chapter, index) => (
					<HomeDecisionStoryChapter key={chapter.chapter} {...chapter} index={index + 1} />
				))}
			</ol>
		</div>
	</section>
);
