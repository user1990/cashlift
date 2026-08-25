import { describe, expect, it } from "vitest";
import { HELP_FAQ_GROUPS } from "@/modules/marketing/content";
import { SITE_URL } from "@/services/site";
import sitemap from "./sitemap";

describe("sitemap", () => {
	it("includes every Help FAQ article URL", () => {
		const faqUrls = sitemap()
			.map(({ url }) => url)
			.filter((url) => url.includes("/help/"));
		const faqSlugs = HELP_FAQ_GROUPS.flatMap(({ items }) => items.map(({ slug }) => slug));
		const expectedFaqUrls = faqSlugs.map((slug) => `${SITE_URL}/help/${slug}`);

		expect(faqUrls.toSorted()).toEqual(expectedFaqUrls.toSorted());
	});
});
