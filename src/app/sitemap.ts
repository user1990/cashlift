import type { MetadataRoute } from "next";
import { HELP_FAQ_GROUPS } from "@/modules/marketing/content";
import { SITE_LAST_MODIFIED, SITE_URL } from "@/services/site";

const INDEXABLE_PATHS = [
	"/",
	"/features",
	"/demo",
	"/pricing",
	"/help",
	"/customers",
	"/contact",
	"/developers",
	"/use-cases/agencies",
	"/use-cases/consulting",
	"/use-cases/software-services",
	"/terms",
	"/privacy",
] as const;

const HELP_FAQ_PATHS = HELP_FAQ_GROUPS.flatMap(({ items }) => items.map(({ slug }) => `/help/${slug}`));

export default function sitemap(): MetadataRoute.Sitemap {
	return [...INDEXABLE_PATHS, ...HELP_FAQ_PATHS].map((pathname) => ({
		changeFrequency: pathname === "/" ? "weekly" : "monthly",
		lastModified: SITE_LAST_MODIFIED,
		priority: pathname === "/" ? 1 : 0.7,
		url: `${SITE_URL}${pathname}`,
	}));
}
