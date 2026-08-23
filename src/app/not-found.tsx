export default function NotFound() {
	return (
		<main className="grid min-h-dvh place-items-center bg-shell px-6 py-16 text-shell-foreground">
			<section className="w-full max-w-xl">
				<p className="text-primary text-s+ uppercase tracking-normal">CashLift</p>

				<h1 className="mt-4 text-5xl+ tracking-normal">Page not found</h1>

				<p className="mt-5 max-w-lg text-shell-muted text-xl leading-8">
					That CashLift page does not exist. Use the sitemap, agent guidance, or help index to find the right place.
				</p>

				<nav aria-label="Not found recovery" className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-primary">
					<a href="/">Home</a>

					<a href="/sitemap.xml">Sitemap</a>

					<a href="/llms.txt">Agent guidance</a>

					<a href="/help">Help</a>
				</nav>
			</section>
		</main>
	);
}
