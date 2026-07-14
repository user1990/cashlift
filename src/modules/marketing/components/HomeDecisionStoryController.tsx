"use client";

import { useEffect } from "react";

export const HomeDecisionStoryController = () => {
	useEffect(() => {
		const story = document.querySelector<HTMLElement>("[data-home-story]");
		const chapters = story?.querySelectorAll<HTMLElement>("[data-story-chapter]");

		if (!story || !chapters?.length || !("IntersectionObserver" in window)) {
			return;
		}

		story.dataset.enhanced = "true";
		const observer = new IntersectionObserver(
			(entries) => {
				const activeEntry = entries.find((entry) => entry.isIntersecting);
				const activeChapter = activeEntry?.target.getAttribute("data-story-chapter");

				if (activeChapter) {
					story.dataset.activeChapter = activeChapter;
				}
			},
			{ rootMargin: "-38% 0px -38%", threshold: 0 },
		);

		chapters.forEach((chapter) => {
			observer.observe(chapter);
		});

		return () => observer.disconnect();
	}, []);

	return null;
};
