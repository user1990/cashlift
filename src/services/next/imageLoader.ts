"use client";

type ImageLoaderProps = {
	quality?: number;
	src: string;
	width: number;
};

const HERO_IMAGE_PATH = "/marketing/studio-nova-inbox-1200.webp";

export default function imageLoader({ quality, src, width }: ImageLoaderProps) {
	if (src === HERO_IMAGE_PATH) {
		if (width <= 384) {
			return "/marketing/studio-nova-inbox-384.webp";
		}

		return width <= 768 ? "/marketing/studio-nova-inbox-768.webp" : HERO_IMAGE_PATH;
	}

	return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
