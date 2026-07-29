import { ShellContainer } from "@/modules/page-shell/components/ShellContainer";
import { ShellSection } from "@/modules/page-shell/components/ShellSection";
import { DEMO_STEPS } from "../content";

export const FeaturesDemoStepsSection = () => (
	<ShellSection>
		<ShellContainer className="py-12 sm:px-6 md:grid-cols-3 lg:px-8">
			<ol className="contents">
				{DEMO_STEPS.map(({ description, icon: Icon, title }) => (
					<li key={title}>
						<Icon aria-hidden className="size-5 text-primary" />

						<h2 className="mt-4 text-shell-foreground text-xl+">{title}</h2>

						<p className="mt-2 text-m text-shell-muted leading-6">{description}</p>
					</li>
				))}
			</ol>
		</ShellContainer>
	</ShellSection>
);
