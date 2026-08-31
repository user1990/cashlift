import { FEATURE_CARDS } from "../content";
import { Hero } from "./Hero";
import { IconCard } from "./IconCard";

export const FeaturesHeroSection = () => (
	<section className="mx-auto w-full max-w-295 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
		<Hero
			description="Make every spend decision cash-aware with cash signals your team can act on throughout the day."
			label="Features"
			variant="page-title"
		/>

		<ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{FEATURE_CARDS.map(({ description, icon: Icon, title }) => (
				<li key={title}>
					<IconCard description={description} Icon={Icon} title={title} />
				</li>
			))}
		</ul>
	</section>
);
