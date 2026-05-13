"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

type RevealProps = {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
	once?: boolean;
	y?: number;
};

export const Reveal = ({ children, className, delay = 0, duration = 0.24, once = true, y = 12 }: RevealProps) => {
	const reducedMotion = useReducedMotion();

	return (
		<m.div
			className={className}
			initial={reducedMotion ? false : { opacity: 0, y }}
			transition={{ delay, duration, ease: "easeOut", type: "tween" }}
			viewport={{ amount: 0.18, once }}
			whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
		>
			{children}
		</m.div>
	);
};
