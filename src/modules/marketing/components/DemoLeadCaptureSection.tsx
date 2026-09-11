import Image from "next/image";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";
import { DEMO_PAGE } from "../site";
import { ActionLink } from "./ActionLink";

const DEMO_BOOK_CARD_BACKGROUND_SRC = "/marketing/demo-book-card-bg.webp";

export const DemoLeadCaptureSection = () => (
	<Panel
		as="section"
		variant="glass"
		className={cn(
			"relative isolate flex flex-col bg-transparent p-5 shadow-none backdrop-blur-none md:p-6 lg:self-start",
			"[&_[data-slot=field-label]]:text-shell-foreground",
			"[&_[data-slot=input]]:border-shell-border [&_[data-slot=input]]:bg-shell/40 [&_[data-slot=input]]:text-shell-foreground",
			"[&_[data-slot=combobox-input]]:border-shell-border [&_[data-slot=combobox-input]]:bg-shell/40 [&_[data-slot=combobox-input]]:text-shell-foreground",
			"[&_[data-slot=combobox-list]]:border-shell-border [&_[data-slot=combobox-list]]:bg-shell-elevated/95",
		)}
	>
		<div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
			<Image
				alt=""
				width={768}
				height={1152}
				sizes="(min-width: 1024px) 24rem, calc(100vw - 2rem)"
				src={DEMO_BOOK_CARD_BACKGROUND_SRC}
				className="pointer-events-none absolute inset-x-0 top-0 h-auto w-full object-contain object-top p-3"
			/>

			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-shell/55 backdrop-blur-sm max-md:bg-shell/85 max-md:backdrop-blur-none"
			/>
		</div>

		<div className="relative flex flex-col">
			<header className="mb-3">
				<p className="text-primary text-s+ uppercase tracking-normal">Next step</p>

				<h2 className="mt-2 text-l+ text-shell-foreground">Explore or contact us</h2>
			</header>

			<p className="text-m text-shell-muted leading-6">{DEMO_PAGE.description}</p>

			<div className="mt-5 grid gap-2 sm:grid-cols-2">
				<ActionLink href="/demo/workspace" className="w-full">
					Explore live demo
				</ActionLink>

				<ActionLink href="/contact" variant="secondary" className="w-full">
					Contact CashLift
				</ActionLink>
			</div>
		</div>
	</Panel>
);
