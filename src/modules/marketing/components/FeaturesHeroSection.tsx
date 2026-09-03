import { FEATURE_CARDS } from "../content";
import { FEATURES_PAGE } from "../site";
import { Hero } from "./Hero";
import { IconCard } from "./IconCard";

export const FeaturesHeroSection = () => (
	<section className="mx-auto w-full max-w-295 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
		<Hero description={FEATURES_PAGE.description} label={FEATURES_PAGE.label} variant="page-title" />

		<ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
			{FEATURE_CARDS.map(({ description, icon: Icon, title }, index) => (
				<li key={title} className="group h-full">
					<IconCard description={description} featured={index === 0} Icon={Icon} title={title} />
				</li>
			))}
		</ul>
	</section>
);
