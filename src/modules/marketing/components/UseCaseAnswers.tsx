import { CalendarClock, ReceiptText, Scissors } from "lucide-react";
import Image from "next/image";
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
		<ul className="mt-10 grid gap-4 sm:gap-5">
			{answers.map((answer, index) => {
				const Icon = AGENCY_ANSWER_ICONS[index % AGENCY_ANSWER_ICONS.length];
				const background = AGENCY_ANSWER_BACKGROUNDS[index % AGENCY_ANSWER_BACKGROUNDS.length];

				return (
					<li key={answer}>
						<Panel
							as="article"
							variant="glass"
							className={cn(
								"group relative isolate flex min-h-44 items-center overflow-hidden bg-shell-elevated/55 px-5 py-6 shadow-none sm:min-h-52 sm:px-10",
								index === answers.length - 1 && "border-primary/80 shadow-primary-glow",
							)}
						>
							<Image
								fill
								loading="eager"
								priority={index === 0}
								sizes="(min-width: 1024px) 72rem, calc(100vw - 2rem)"
								src={background.src}
								alt=""
								className="pointer-events-none object-cover opacity-85"
							/>

							<div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-shell/40" />

							<div className="relative z-10 flex w-full items-center gap-4 sm:gap-10">
								<span
									aria-hidden="true"
									className="relative grid size-16 shrink-0 place-items-center rounded-lg border border-shell-border bg-shell/80 text-primary shadow-shell before:absolute before:inset-2 before:rounded-md before:border before:border-primary/20 before:content-[''] sm:size-24"
								>
									<Icon className="relative size-7 stroke-[1.5] sm:size-10" />
								</span>

								<p className="max-w-4xl font-medium text-m+ text-shell-foreground leading-7 sm:text-xl+ sm:leading-8">
									{answer}
								</p>
							</div>
						</Panel>
					</li>
				);
			})}
		</ul>
	);
}

const AGENCY_ANSWER_BACKGROUNDS = [
	{ src: "/marketing/agencies-runway-calendar.webp" },
	{ src: "/marketing/agencies-runway-invoice.webp" },
	{ src: "/marketing/agencies-runway-vendor.webp" },
] as const;
