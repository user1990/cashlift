import { ChevronDown } from "lucide-react";

const HOME_FAQS = [
	{
		answer:
			"CashLift ranks the demo workspace by cash impact and urgency, then keeps the reason for each action beside the decision.",
		question: "How does CashLift rank actions?",
	},
	{
		answer: "The daily inbox groups the demo actions into collection, approval, and renewal decisions.",
		question: "What kinds of actions does CashLift surface?",
	},
	{
		answer:
			"Each example keeps its cash impact, urgency, owner, and supporting context next to the recommended action.",
		question: "What context comes with each action?",
	},
	{
		answer:
			"The live demo uses a read-only Studio Nova workspace. It does not claim or require a production integration to explore the workflow.",
		question: "Where does CashLift get its data?",
	},
	{
		answer:
			"No. The Studio Nova workspace is a read-only sample, so you can explore it without entering company records.",
		question: "Can I try the demo with real company data?",
	},
	{
		answer: "No. The live demo is available to explore without creating an account.",
		question: "Do I need an account to explore the demo?",
	},
	{
		answer: "No. This demo does not move money, issue cards, or provide financial, legal, or tax advice.",
		question: "Does the demo make payments or financial decisions for me?",
	},
	{
		answer: "The landing page is designed around service-firm questions: what to collect, approve, or cut today.",
		question: "Who is the demo designed for?",
	},
	{
		answer:
			"Start with the ranked daily inbox, then open a collection, approval, or renewal example to see its context.",
		question: "Where should I start in the live demo?",
	},
	{
		answer: "Open the live demo to review the daily inbox without creating an account or moving any money.",
		question: "How can we get started?",
	},
] as const;

export const HomeFaqSection = () => (
	<section aria-labelledby="home-faq-title" className="border-shell-border border-b bg-shell">
		<div className="mx-auto max-w-250 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
			<h2 id="home-faq-title" className="text-5xl+ text-primary tracking-normal sm:text-7xl+">
				FAQ
			</h2>

			<div className="mt-5 border-shell-border border-t">
				{HOME_FAQS.map(({ answer, question }) => (
					<details key={question} className="group border-shell-border border-b">
						<summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-l text-shell-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
							{question}

							<ChevronDown
								aria-hidden
								className="size-5 shrink-0 text-shell-muted transition-transform duration-150 group-open:rotate-180"
							/>
						</summary>

						<p className="max-w-3xl pb-5 text-l text-shell-muted leading-7">{answer}</p>
					</details>
				))}
			</div>
		</div>
	</section>
);
