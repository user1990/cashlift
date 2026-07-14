const story = document.querySelector("[data-home-story]");
const chapters = story?.querySelectorAll("[data-story-chapter]");

if (story && chapters?.length && "IntersectionObserver" in window) {
	story.dataset.enhanced = "true";
	const observer = new IntersectionObserver(
		(entries) => {
			const activeChapter = entries.find((entry) => entry.isIntersecting)?.target.getAttribute("data-story-chapter");

			if (activeChapter) {
				story.dataset.activeChapter = activeChapter;
			}
		},
		{ rootMargin: "-38% 0px -38%", threshold: 0 },
	);

	chapters.forEach((chapter) => {
		observer.observe(chapter);
	});
}
