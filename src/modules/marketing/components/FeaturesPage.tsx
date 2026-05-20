import { ArrowRight } from "lucide-react";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { ShellContainer } from "@/modules/page-shell/components/ShellContainer";
import { ShellSection } from "@/modules/page-shell/components/ShellSection";
import { DEMO_STEPS, FEATURE_CARDS } from "../content";
import { MarketingActionLink } from "./MarketingActionLink";
import { MarketingHero } from "./MarketingHero";
import { MarketingIconCard } from "./MarketingIconCard";

export const FeaturesPage = () => (
	<MainContent variant="plain">
		<section className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<MarketingHero
				description="CashLift sits above accounting data and turns company cash signals into work your team can act on several times a day."
				label="Features"
				title="Make every spend decision cash-aware."
			/>

			<ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{FEATURE_CARDS.map(({ description, icon: Icon, title }) => (
					<li key={title}>
						<MarketingIconCard description={description} Icon={Icon} title={title} />
					</li>
				))}
			</ul>
		</section>

		<ShellSection>
			<ShellContainer className="py-12 sm:px-6 md:grid-cols-3 lg:px-8">
				<ol className="contents">
					{DEMO_STEPS.map(({ description, icon: Icon, title }) => (
						<li key={title}>
							<Icon aria-hidden className="size-5 text-primary" />

							<h2 className="mt-4 text-xl+ text-shell-foreground">{title}</h2>

							<p className="mt-2 text-m leading-6 text-shell-muted">{description}</p>
						</li>
					))}
				</ol>
			</ShellContainer>
		</ShellSection>

		<section className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
			<div>
				<p className="text-s+ uppercase tracking-normal text-primary">Get started</p>

				<h2 className="mt-2 text-4xl+ tracking-normal text-shell-foreground">
					Open the product demo or run a leak audit.
				</h2>
			</div>

			<MarketingActionLink href="/demo">
				See demo
				<ArrowRight aria-hidden className="size-4" />
			</MarketingActionLink>
		</section>
	</MainContent>
);
