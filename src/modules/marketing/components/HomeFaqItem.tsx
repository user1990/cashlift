"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/ui/utils/cn";

type HomeFaqItemProps = {
	answer: string;
	question: string;
};

export const HomeFaqItem = ({ answer, question }: HomeFaqItemProps) => {
	const answerId = useId();
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="border-shell-border border-b">
			<button
				aria-controls={answerId}
				aria-expanded={expanded}
				data-no-press-scale="true"
				type="button"
				onClick={() => setExpanded((isExpanded) => !isExpanded)}
				className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-3 text-left text-l text-shell-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
			>
				{question}

				<ChevronDown
					aria-hidden
					className={cn(
						"size-5 shrink-0 text-shell-muted transition-[color,rotate] duration-[var(--motion-duration-micro)] ease-in-out group-hover:text-primary motion-reduce:transition-none",
						expanded && "rotate-180",
					)}
				/>
			</button>

			<div
				className={cn(
					"grid overflow-hidden transition-[grid-template-rows] duration-[var(--motion-duration-standard)] ease-out motion-reduce:transition-none",
					expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				)}
			>
				<div className="block min-h-0 overflow-hidden">
					<p
						id={answerId}
						className={cn(
							"max-w-3xl pb-5 text-l text-shell-muted leading-7 transition-[opacity,transform] duration-[var(--motion-duration-standard)] ease-out motion-reduce:transition-none",
							expanded ? "translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
						)}
					>
						{answer}
					</p>
				</div>
			</div>
		</div>
	);
};
