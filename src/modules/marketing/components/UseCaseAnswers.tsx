import { CalendarClock, ReceiptText, Scissors } from "lucide-react";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";

type UseCaseAnswersProps = {
	answers: readonly string[];
	variant?: "default" | "glass";
};

export const UseCaseAnswers = ({ answers, variant = "default" }: UseCaseAnswersProps) => {
	if (variant === "glass") {
		return renderGlassAnswers(answers);
	}

	return (
		<ul className="mt-10 grid gap-4 md:grid-cols-3">
			{answers.map((answer) => (
				<li key={answer}>
					<Panel as="article" className="h-full">
						<p className="text-m+ text-panel-foreground">{answer}</p>
					</Panel>
				</li>
			))}
		</ul>
	);
};

const AGENCY_ANSWER_ICONS = [CalendarClock, ReceiptText, Scissors] as const;

function renderGlassAnswers(answers: readonly string[]) {
	return (
		<ul className="mt-10 grid gap-5">
			{answers.map((answer, index) => {
				const Icon = AGENCY_ANSWER_ICONS[index % AGENCY_ANSWER_ICONS.length];

				return (
					<li key={answer}>
						<Panel
							as="article"
							variant="glass"
							className={cn(
								"group relative flex min-h-64 flex-col items-center justify-center overflow-hidden bg-shell-elevated/60 px-6 py-8 text-center shadow-none sm:min-h-72 sm:px-10",
								index === answers.length - 1 && "border-primary/80 shadow-primary-glow",
							)}
						>
							<span
								aria-hidden="true"
								className="relative grid size-24 place-items-center rounded-lg border border-shell-border bg-shell/70 text-primary shadow-shell before:absolute before:inset-2 before:rounded-md before:border before:border-primary/20 before:content-['']"
							>
								<Icon className="relative size-10 stroke-[1.5]" />
							</span>

							<p className="mt-7 max-w-3xl font-medium text-m+ text-shell-foreground leading-7 sm:text-xl+ sm:leading-8">
								{answer}
							</p>
						</Panel>
					</li>
				);
			})}
		</ul>
	);
}
