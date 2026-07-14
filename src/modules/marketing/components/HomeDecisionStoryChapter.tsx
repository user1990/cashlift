import type { ReactNode } from "react";
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
}: HomeDecisionStoryChapterProps) => (
	<li
		className="home-story-chapter flex flex-col justify-center py-12 lg:min-h-[78vh] lg:py-20"
		data-story-chapter={chapter}
	>
		<article className="max-w-xl">
			<p className="flex items-center gap-3 text-s+ font-semibold uppercase tracking-normal text-primary">
				<span className="font-mono text-shell-muted">0{index}</span>
				{eyebrow}
			</p>

			<h3 className="mt-4 text-4xl+ tracking-normal text-shell-foreground sm:text-5xl+">{title}</h3>

			<p className="mt-5 text-l leading-8 text-shell-muted">{description}</p>
		</article>

		<div className="mt-8 lg:hidden">
			<HomeDecisionStoryImage alt={imageAlt} src={imageSrc} />
		</div>
	</li>
);
