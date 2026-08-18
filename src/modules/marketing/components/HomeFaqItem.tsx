"use client";

import { ChevronDown } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/ui/utils/cn";

const FAQ_TOGGLE_MS = 300;
const FAQ_TOGGLE_EASING = "ease";
const FAQ_ANSWER_HIDDEN = { opacity: 0, transform: "translateY(0.5rem)" };
const FAQ_ANSWER_VISIBLE = { opacity: 1, transform: "translateY(0)" };

type HomeFaqItemProps = {
	answer: string;
	question: string;
};

export const HomeFaqItem = ({ answer, question }: HomeFaqItemProps) => {
	const answerId = useId();
	const answerRef = useRef<HTMLParagraphElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const answerAnimationRef = useRef<Animation | null>(null);
	const panelAnimationRef = useRef<Animation | null>(null);
	const [expanded, setExpanded] = useState(false);

	useLayoutEffect(() => {
		if (!expanded) {
			return;
		}

		const answerNode = answerRef.current;
		const panel = panelRef.current;
		if (!panel || !canAnimate(panel)) {
			return;
		}

		cancelAnimation(panelAnimationRef);
		cancelAnimation(answerAnimationRef);

		const endHeight = panel.scrollHeight;
		panel.style.height = "0px";
		panel.getBoundingClientRect();

		const panelAnimation = panel.animate([{ height: "0px" }, { height: `${endHeight}px` }], {
			duration: FAQ_TOGGLE_MS,
			easing: FAQ_TOGGLE_EASING,
			fill: "forwards",
		});
		panelAnimationRef.current = panelAnimation;

		if (answerNode) {
			answerAnimationRef.current = answerNode.animate([FAQ_ANSWER_HIDDEN, FAQ_ANSWER_VISIBLE], {
				duration: FAQ_TOGGLE_MS,
				easing: FAQ_TOGGLE_EASING,
				fill: "forwards",
			});
		}

		void panelAnimation.finished
			.then(() => {
				if (panelAnimationRef.current !== panelAnimation) {
					return;
				}

				panel.style.height = "auto";
				panelAnimation.cancel();
			})
			.catch(() => undefined);
	}, [expanded]);

	const toggleExpanded = () => {
		if (expanded) {
			collapseAnswer(panelRef.current, answerRef.current, panelAnimationRef, answerAnimationRef, () => {
				setExpanded(false);
			});
			return;
		}

		setExpanded(true);
	};

	return (
		<div className="border-shell-border border-b">
			<button
				aria-controls={answerId}
				aria-expanded={expanded}
				type="button"
				onClick={toggleExpanded}
				className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-3 text-left text-l text-shell-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
			>
				{question}

				<ChevronDown
					aria-hidden
					className={cn(
						"size-5 shrink-0 text-shell-muted transition-[color,transform] duration-300 group-hover:text-primary",
						expanded && "rotate-180",
					)}
				/>
			</button>

			<div ref={panelRef} hidden={!expanded} className="block h-0 overflow-hidden">
				<p ref={answerRef} id={answerId} className="max-w-3xl pb-5 text-l text-shell-muted leading-7">
					{answer}
				</p>
			</div>
		</div>
	);
};

function canAnimate(element: HTMLElement) {
	return (
		typeof element.animate === "function" &&
		!(typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
	);
}

function cancelAnimation(animationRef: { current: Animation | null }) {
	animationRef.current?.cancel();
	animationRef.current = null;
}

function collapseAnswer(
	panel: HTMLDivElement | null,
	answerNode: HTMLParagraphElement | null,
	panelAnimationRef: { current: Animation | null },
	answerAnimationRef: { current: Animation | null },
	onCollapsed: () => void,
) {
	if (!panel || !canAnimate(panel)) {
		if (panel) {
			panel.style.height = "";
		}

		onCollapsed();
		return;
	}

	cancelAnimation(panelAnimationRef);
	cancelAnimation(answerAnimationRef);

	const startHeight = Math.max(panel.scrollHeight, panel.getBoundingClientRect().height);
	panel.style.height = `${startHeight}px`;

	const panelAnimation = panel.animate([{ height: `${startHeight}px` }, { height: "0px" }], {
		duration: FAQ_TOGGLE_MS,
		easing: FAQ_TOGGLE_EASING,
		fill: "forwards",
	});
	panelAnimationRef.current = panelAnimation;

	if (answerNode) {
		answerAnimationRef.current = answerNode.animate([FAQ_ANSWER_VISIBLE, FAQ_ANSWER_HIDDEN], {
			duration: FAQ_TOGGLE_MS,
			easing: FAQ_TOGGLE_EASING,
			fill: "forwards",
		});
	}

	void panelAnimation.finished
		.then(() => {
			if (panelAnimationRef.current !== panelAnimation) {
				return;
			}

			panel.style.height = "";
			panelAnimation.cancel();
			cancelAnimation(answerAnimationRef);
			onCollapsed();
		})
		.catch(() => undefined);
}
