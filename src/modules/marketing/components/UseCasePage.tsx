import Link from "next/link";
import { Panel } from "@/ui/components/Panel";
import type { USE_CASES } from "../content";

type UseCasePageProps = {
	useCase: (typeof USE_CASES)[keyof typeof USE_CASES];
};

export const UseCasePage = ({ useCase }: UseCasePageProps) => (
	<main id="main-content" className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
		<p className="text-s+ uppercase tracking-normal text-primary">{useCase.label}</p>

		<h1 className="mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground">{useCase.headline}</h1>

		<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">{useCase.description}</p>

		<ul className="mt-10 grid gap-4 md:grid-cols-3">
			{useCase.answers.map((answer) => (
				<li key={answer}>
					<Panel as="article">
						<p className="text-m+ text-panel-foreground">{answer}</p>
					</Panel>
				</li>
			))}
		</ul>

		<Link
			className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-primary bg-primary px-4 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
			href="/demo"
		>
			Run use-case demo
		</Link>
	</main>
);
