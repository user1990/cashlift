import { Panel } from "@/ui/components/layout/Panel";

type UseCaseAnswersProps = {
	answers: readonly string[];
};

export const UseCaseAnswers = ({ answers }: UseCaseAnswersProps) => (
	<ul className="mt-10 grid gap-4 md:grid-cols-3">
		{answers.map((answer) => (
			<li key={answer}>
				<Panel as="article">
					<p className="text-m+ text-panel-foreground">{answer}</p>
				</Panel>
			</li>
		))}
	</ul>
);
