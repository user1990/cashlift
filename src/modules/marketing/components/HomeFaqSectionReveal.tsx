"use client";

import { type ReactNode, useEffect, useRef } from "react";

type HomeFaqSectionRevealProps = {
	children: ReactNode;
};

export const HomeFaqSectionReveal = ({ children }: HomeFaqSectionRevealProps) => {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) {
			return;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			section.dataset.homeFaqVisible = "true";
			return;
		}

		const reveal = () => {
			section.dataset.homeFaqAnimate = "true";
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					section.dataset.homeFaqVisible = "true";
				});
			});
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					reveal();
					observer.disconnect();
				}
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
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
