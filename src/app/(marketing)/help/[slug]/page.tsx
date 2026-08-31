import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpFaqArticlePage } from "@/modules/marketing/components/HelpFaqArticlePage";
import { getHelpFaqArticleBySlug, getHelpFaqItemBySlug } from "@/modules/marketing/content";
import { parseHelpFaqQuery } from "@/modules/marketing/utils";

type HelpFaqArticleRouteProps = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ q?: string | string[] }>;
};

export const instant = false;

export async function generateMetadata({ params }: HelpFaqArticleRouteProps): Promise<Metadata> {
	const { slug } = await params;
	const item = getHelpFaqItemBySlug(slug);

	if (!item) {
		notFound();
	}

	const article = getHelpFaqArticleBySlug(slug);

	return {
		alternates: { canonical: `/help/${item.slug}` },
		description: article?.description ?? item.answer,
		title: `${item.question} — CashLift`,
	};
}

export default async function HelpFaqArticleRoute({ params, searchParams }: HelpFaqArticleRouteProps) {
	const { slug } = await params;
	const item = getHelpFaqItemBySlug(slug);

	if (!item) {
		notFound();
	}

	const article = getHelpFaqArticleBySlug(slug);
	const { q } = await searchParams;
	const query = parseHelpFaqQuery(q);
	const relatedItems = (article?.relatedSlugs ?? [])
		.map((relatedSlug) => getHelpFaqItemBySlug(relatedSlug))
		.filter((relatedItem): relatedItem is NonNullable<typeof relatedItem> => Boolean(relatedItem));

	return (
		<HelpFaqArticlePage
			article={article}
			item={item}
			query={query}
			relatedItems={relatedItems}
			returnHref={query ? `/help?q=${encodeURIComponent(query)}` : "/help"}
		/>
	);
}
