"use client";

import { type ReactNode, useEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type HomeFaqSectionRevealProps = {
	children: ReactNode;
};

const canRevealOnScroll = () =>
	typeof window.matchMedia === "function" &&
	!window.matchMedia(REDUCED_MOTION_QUERY).matches &&
	typeof IntersectionObserver === "function";

export const HomeFaqSectionReveal = ({ children }: HomeFaqSectionRevealProps) => {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) {
			return;
		}

		if (!canRevealOnScroll()) {
			section.dataset.homeFaqVisible = "true";
			return;
		}

		section.dataset.homeFaqArmed = "true";

		const reveal = () => {
			section.dataset.homeFaqVisible = "true";
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					reveal();
					observer.disconnect();
				}
			},
			{ rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
		);

		observer.observe(section);

		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={sectionRef}
			aria-labelledby="home-faq-title"
			data-home-faq
			className="border-shell-border border-b bg-shell"
		>
			{children}
		</section>
	);
};
