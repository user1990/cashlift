import { cn } from "@/ui/utils/cn";
import type { HomeDecisionStoryAction } from "../types";
import { HomeDecisionStoryImage } from "./HomeDecisionStoryImage";

type HomeDecisionStoryChapterProps = {
	action: HomeDecisionStoryAction;
	imageAlt: string;
	imageSrc: string;
	offsetClassName: string;
	stackClassName: string;
	stackIndex: number;
};

export const HomeDecisionStoryChapter = ({
	action,
	imageAlt,
	imageSrc,
	offsetClassName,
	stackClassName,
	stackIndex,
}: HomeDecisionStoryChapterProps) => {
	const chapterStyle = CHAPTER_STYLES[action.type];

	return (
		<li
			id={`decision-${action.type}`}
			data-story-chapter={action.type}
			data-story-stack={stackIndex}
			className={cn("scroll-mt-24 lg:sticky lg:top-20", stackClassName)}
		>
			<article
				className={cn(
					"relative overflow-hidden rounded-xl border border-shell-border border-t-4 bg-shell-elevated p-5 text-shell-foreground shadow-panel sm:p-7 lg:p-8",
					offsetClassName,
					chapterStyle.border,
				)}
			>
				<div className="grid gap-7 border-shell-border border-b pb-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-10">
					<div>
						<h3 className={cn("max-w-xl text-5xl+ capitalize tracking-normal lg:text-6xl+", chapterStyle.text)}>
							{action.type}
						</h3>

						<p className="mt-5 max-w-xl text-l text-shell-foreground leading-7">
							{action.title} {action.description}
						</p>
					</div>

					<div className="lg:py-10">
						<HomeDecisionStoryImage alt={imageAlt} src={imageSrc} />
					</div>
				</div>

				<dl className="grid grid-cols-3 gap-4 pt-5">
					<DecisionDetail label="Impact" value={action.impact} />

					<DecisionDetail label="Urgency" value={action.priority} capitalize />

					<DecisionDetail label="Owner" value={action.owner} />
				</dl>
			</article>
		</li>
	);
};

const CHAPTER_STYLES = {
	approve: { border: "border-t-warning", text: "text-warning" },
	collect: { border: "border-t-primary", text: "text-primary" },
	cut: { border: "border-t-highlight", text: "text-highlight" },
} as const;

type DecisionDetailProps = { label: string; value: string; capitalize?: boolean };

function DecisionDetail({ capitalize = false, label, value }: DecisionDetailProps) {
	return (
		<div>
			<dt className="font-mono text-shell-muted text-xs uppercase tracking-wider">{label}</dt>

			<dd className={cn("mt-2 font-mono text-m sm:text-l", capitalize && "capitalize")}>{value}</dd>
		</div>
	);
}
