import Script from "next/script";
import { HomeDecisionStoryChapter } from "./HomeDecisionStoryChapter";
import { HomeDecisionStoryImage } from "./HomeDecisionStoryImage";

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
	<section
		aria-labelledby="decision-story-title"
		className="home-story border-b border-shell-border"
		data-active-chapter="approve"
		data-home-story
	>
		<Script src="/marketing/home-story.js" strategy="afterInteractive" />

		<header className="mx-auto max-w-[1180px] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-28">
			<p className="text-s+ font-semibold uppercase tracking-normal text-primary">From inbox to decision</p>

			<h2
				id="decision-story-title"
				className="mt-3 max-w-3xl text-4xl+ tracking-normal text-shell-foreground sm:text-6xl+"
			>
				Three decisions. One daily view.
			</h2>
		</header>

		<div className="mx-auto grid max-w-[1180px] gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-8 lg:pb-28">
			<ol>
				{DECISION_CHAPTERS.map((chapter, index) => (
					<HomeDecisionStoryChapter key={chapter.chapter} {...chapter} index={index + 1} />
				))}
			</ol>

			<div className="home-story-stage hidden lg:grid lg:gap-6">
				{DECISION_CHAPTERS.map(({ chapter, imageAlt, imageSrc }) => (
					<figure className="home-story-media" data-story-media={chapter} key={chapter}>
						<HomeDecisionStoryImage alt={imageAlt} src={imageSrc} />
					</figure>
				))}
			</div>
		</div>
	</section>
);
