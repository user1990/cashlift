"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FAQ_PREHIDE_CLASS = "home-faq-prehide";
const FAQ_REVEAL_CLASS = "home-faq-reveal-in";

type HomeFaqSectionRevealProps = {
	children: ReactNode;
};

const canRevealOnScroll = () =>
	typeof window.matchMedia === "function" &&
	!window.matchMedia(REDUCED_MOTION_QUERY).matches &&
	typeof IntersectionObserver === "function";

const getRevealTargets = (section: HTMLElement) => [...section.querySelectorAll<HTMLElement>("[data-home-faq-item]")];

export const HomeFaqSectionReveal = ({ children }: HomeFaqSectionRevealProps) => {
	const sectionRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const section = sectionRef.current;
		if (!section) {
			return;
		}

		const targets = getRevealTargets(section);
		if (!canRevealOnScroll() || targets.length === 0) {
			section.dataset.homeFaqRevealed = "true";
			return;
		}

		const list = section.querySelector<HTMLElement>("[data-home-faq-list]");
		if (list) {
			list.classList.add(FAQ_PREHIDE_CLASS);
		}

		for (const target of targets) {
			target.classList.add(FAQ_PREHIDE_CLASS);
		}

		const revealList = () => {
			if (!list || list.dataset.homeFaqAnimated === "true") {
				return;
			}

			list.dataset.homeFaqAnimated = "true";
			list.classList.add(FAQ_REVEAL_CLASS);
			list.classList.remove(FAQ_PREHIDE_CLASS);
		};

		const revealTarget = (target: HTMLElement) => {
			if (target.dataset.homeFaqAnimated === "true") {
				return;
			}

			revealList();
			target.dataset.homeFaqAnimated = "true";
			target.classList.add(FAQ_REVEAL_CLASS);
			target.classList.remove(FAQ_PREHIDE_CLASS);
		};

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) {
						continue;
					}

					const target = entry.target;
					if (target instanceof HTMLElement) {
						revealTarget(target);
						observer.unobserve(target);
					}
				}
			},
			{ rootMargin: "0px 0px -30% 0px", threshold: 0.35 },
		);

		for (const target of targets) {
			observer.observe(target);
		}

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
