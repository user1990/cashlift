import { cn } from "@/ui/utils/cn";
import type { HomeDecisionStoryAction } from "../types";
import { HomeDecisionStoryImage } from "./HomeDecisionStoryImage";

type HomeDecisionStoryChapterProps = {
	action: HomeDecisionStoryAction;
	context: string;
	imageAlt: string;
	imageSrc: string;
	index: number;
};

export const HomeDecisionStoryChapter = ({
	action,
	context,
	imageAlt,
	imageSrc,
	index,
}: HomeDecisionStoryChapterProps) => {
	const chapterStyle = CHAPTER_STYLES[action.type];

	return (
		<li
			id={`decision-${action.type}`}
			data-story-chapter={action.type}
			className={cn(
				"mb-8 scroll-mt-28 lg:sticky lg:mb-[16svh] motion-reduce:lg:static motion-reduce:lg:mb-8",
				chapterStyle.position,
			)}
		>
			<article
				className={cn(
					"relative overflow-hidden rounded-xl border border-shell-border border-t-4 bg-shell-elevated p-5 text-shell-foreground shadow-panel sm:p-7 lg:p-8",
					chapterStyle.border,
				)}
			>
				<div className="grid gap-7 border-shell-border border-b pb-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-10">
					<div className="self-stretch">
						<p className="font-mono text-shell-muted text-s">0{index} / 03</p>

						<p className={cn("mt-4 font-semibold text-s+ uppercase tracking-normal", chapterStyle.text)}>
							{action.type}
						</p>

						<h3 className="mt-3 max-w-xl text-3xl+ tracking-normal sm:text-4xl+ lg:text-5xl+">{context}</h3>

						<p className="mt-6 max-w-xl text-2xl+ tracking-normal sm:text-3xl+">{action.title}</p>

						<p className="mt-4 max-w-xl text-l text-shell-muted leading-7">{action.description}</p>
					</div>

					<HomeDecisionStoryImage alt={imageAlt} src={imageSrc} />
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
	approve: {
		border: "border-t-warning",
		position: "lg:top-28 lg:z-20",
		text: "text-warning",
	},
	collect: {
		border: "border-t-primary",
		position: "lg:top-24 lg:z-10",
		text: "text-primary",
	},
	cut: {
		border: "border-t-highlight",
		position: "lg:top-32 lg:z-30 lg:mb-0",
		text: "text-highlight",
	},
} as const;

type DecisionDetailProps = {
	label: string;
	value: string;
	capitalize?: boolean;
};

function DecisionDetail({ capitalize = false, label, value }: DecisionDetailProps) {
	return (
		<div>
			<dt className="font-mono text-shell-muted text-xs uppercase tracking-wider">{label}</dt>

			<dd className={cn("mt-2 font-mono text-m sm:text-l", capitalize && "capitalize")}>{value}</dd>
		</div>
	);
}
