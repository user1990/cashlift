import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";
import { HomeDecisionStoryImage } from "./HomeDecisionStoryImage";

type HomeDecisionStoryChapterProps = {
	chapter: string;
	description: string;
	eyebrow: string;
	imageAlt: string;
	imageSrc: string;
	index: number;
	title: ReactNode;
};

export const HomeDecisionStoryChapter = ({
	chapter,
	description,
	eyebrow,
	imageAlt,
	imageSrc,
	index,
	title,
}: HomeDecisionStoryChapterProps) => {
	const imageFirst = index % 2 === 0;

	return (
		<li data-story-chapter={chapter} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
			<article className={cn("max-w-xl", imageFirst && "lg:order-2 lg:pl-6")}>
				<p className="flex items-center gap-3 text-s+ font-semibold uppercase tracking-normal text-primary">
					<span className="font-mono text-shell-muted">0{index}</span>
					{eyebrow}
				</p>

				<h3 className="mt-4 text-4xl+ tracking-normal text-shell-foreground sm:text-5xl+">{title}</h3>

				<p className="mt-5 text-l leading-8 text-shell-muted">{description}</p>
			</article>

			<div className={cn(imageFirst && "lg:order-1")}>
				<HomeDecisionStoryImage alt={imageAlt} src={imageSrc} />
			</div>
		</li>
	);
};
