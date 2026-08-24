import type { MetadataRoute } from "next";
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

export default function sitemap(): MetadataRoute.Sitemap {
	return INDEXABLE_PATHS.map((pathname) => ({
		changeFrequency: pathname === "/" ? "weekly" : "monthly",
		lastModified: SITE_LAST_MODIFIED,
		priority: pathname === "/" ? 1 : 0.7,
		url: `${SITE_URL}${pathname}`,
	}));
}
