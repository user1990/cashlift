import { HOME_FAQ_ITEMS } from "../site";
import { HomeFaqItem } from "./HomeFaqItem";

export const HomeFaqSection = () => (
	<section aria-labelledby="home-faq-title" className="border-shell-border border-b bg-shell">
		<div className="mx-auto max-w-295 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
			<h2 id="home-faq-title" className="text-5xl+ text-primary tracking-normal sm:text-7xl+">
				FAQ
			</h2>

			<div className="mt-5 border-shell-border border-t">
				{HOME_FAQ_ITEMS.map(({ answer, question }) => (
					<HomeFaqItem key={question} answer={answer} question={question} />
				))}
			</div>
		</div>
	</section>
);
