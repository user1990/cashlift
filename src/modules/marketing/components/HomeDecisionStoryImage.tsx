import Image from "next/image";

type HomeDecisionStoryImageProps = {
	alt: string;
	src: string;
};

export const HomeDecisionStoryImage = ({ alt, src }: HomeDecisionStoryImageProps) => (
	<div className="overflow-hidden rounded-xl border border-shell-border bg-shell-elevated shadow-shell">
		<Image
			alt={alt}
			height={720}
			loading="lazy"
			sizes="(min-width: 1180px) 536px, (min-width: 1024px) 46vw, calc(100vw - 2rem)"
			src={src}
			width={1280}
			className="h-auto w-full"
		/>
	</div>
);
