import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import type { HelpFaqArticle, HelpFaqItem } from "../content";
import { HelpContactPanel } from "./HelpContactPanel";
import { Hero } from "./Hero";

type HelpFaqArticlePageProps = {
	article?: HelpFaqArticle;
	item: HelpFaqItem;
	query: string;
	relatedItems: readonly HelpFaqItem[];
	returnHref: string;
};

export const HelpFaqArticlePage = ({ article, item, query, relatedItems, returnHref }: HelpFaqArticlePageProps) => (
	<MainContent variant="marketing">
		<article className="mx-auto max-w-4xl">
			<nav aria-label="Help article navigation">
				<Link
					href={returnHref}
					className="inline-flex min-h-11 items-center gap-2 rounded-md font-medium text-m text-shell-muted outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none"
				>
					<ArrowLeft aria-hidden className="size-4" />
					Back to Help search
				</Link>
			</nav>

			<Hero
				description={article?.description ?? item.answer}
				label={item.question}
				variant="page-title"
				titleClassName="text-4xl sm:text-5xl"
				className="mt-8 max-w-3xl [&>p]:mt-3 [&>p]:text-l [&>p]:leading-7"
			/>

			<section
				aria-labelledby="help-faq-short-answer"
				className="relative isolate mt-10 overflow-hidden rounded-xl border border-primary-subtle-border/70 bg-shell-elevated/45 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.07),0_18px_42px_rgb(0_0_0_/_0.24)] backdrop-blur-md before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-r before:from-primary/10 before:via-transparent before:to-warning/10 before:content-[''] sm:p-7"
			>
				<div className="relative">
					<p className="font-mono text-primary text-s uppercase tracking-[0.14em]">Short answer</p>

					<h2 id="help-faq-short-answer" className="sr-only">
						Short answer
					</h2>

					<p className="mt-3 max-w-3xl text-l text-shell-foreground leading-8 sm:text-xl sm:leading-9">{item.answer}</p>
				</div>
			</section>

			{article?.sections.length && (
				<div className="mt-12 grid gap-9 border-shell-border border-t pt-10 sm:gap-10">
					{article.sections.map(({ body, heading }) => (
						<section key={heading} aria-labelledby={`help-faq-section-${heading}`} className="max-w-3xl">
							<h2 id={`help-faq-section-${heading}`} className="text-2xl text-shell-foreground sm:text-3xl">
								{heading}
							</h2>

							<p className="mt-3 text-m text-shell-muted leading-7 sm:text-l sm:leading-8">{body}</p>
						</section>
					))}
				</div>
			)}

			{relatedItems.length > 0 && (
				<section aria-labelledby="help-faq-related-answers" className="mt-12 border-shell-border border-t pt-10">
					<h2 id="help-faq-related-answers" className="text-2xl text-shell-foreground sm:text-3xl">
						Related answers
					</h2>

					<ul className="mt-5 grid gap-3 sm:grid-cols-3">
						{relatedItems.map(({ question, slug }) => (
							<li key={slug}>
								<Link
									href={helpFaqHref(slug, query)}
									className="group flex min-h-20 items-center justify-between gap-3 rounded-lg border border-shell-border bg-shell-elevated/30 p-4 text-m text-shell-foreground outline-none transition-[border-color,background-color] duration-150 hover:border-primary/60 hover:bg-shell-elevated/55 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25 motion-reduce:transition-none"
								>
									<span>{question}</span>

									<ChevronRight
										aria-hidden
										className="size-4 shrink-0 text-shell-muted transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
									/>
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			<HelpContactPanel />
		</article>
	</MainContent>
);

function helpFaqHref(slug: string, query: string) {
	return query ? `/help/${slug}?q=${encodeURIComponent(query)}` : `/help/${slug}`;
}
