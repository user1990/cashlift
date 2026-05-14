"use client";

import { domAnimation, LazyMotion } from "motion/react";

type MotionProviderProps = {
	children: React.ReactNode;
};

export const MotionProvider = ({ children }: MotionProviderProps) => (
	<LazyMotion features={domAnimation} strict>
		{children}
	</LazyMotion>
);
