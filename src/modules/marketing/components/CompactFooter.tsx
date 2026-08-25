import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import { FOOTER_LINKS } from "../content";
import { FooterAccordion } from "./FooterAccordion";
import { FooterCopyright } from "./FooterCopyright";

const COMPACT_FOOTER_GROUPS = [
	{ label: "Product", links: FOOTER_LINKS[0].links },
	{ label: "Support", links: FOOTER_LINKS[2].links.slice(2) },
	{ label: "Legal", links: FOOTER_LINKS[3].links },
] as const;

export const CompactFooter = () => (
	<footer className="relative isolate mt-auto overflow-hidden border-shell-border border-t bg-shell">
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgb(2_218_235_/_0.14),transparent_30%),radial-gradient(circle_at_18%_88%,rgb(99_44_151_/_0.2),transparent_34%)]"
		/>

		<div className="pointer-events-none absolute top-5 left-1/2 size-48 -translate-x-1/2 rounded-full border border-primary/10 sm:size-64" />

		<div className="pointer-events-none absolute top-12 left-1/2 size-32 -translate-x-1/2 rounded-full border border-primary/15 sm:size-48" />

		<div className="relative mx-auto max-w-295 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
			<div className="lg:hidden">
				<FooterAccordion groups={COMPACT_FOOTER_GROUPS} />
			</div>

			<nav
				aria-label="Footer"
				className="mx-auto hidden max-w-4xl items-start justify-center gap-8 rounded-2xl border border-primary-subtle-border bg-shell-elevated/70 px-6 py-5 text-center backdrop-blur-md lg:flex"
			>
				{COMPACT_FOOTER_GROUPS.map(({ label, links }, index) => (
					<div key={label} className={cn("min-w-0 flex-1", index > 0 && "border-shell-border border-l pl-8")}>
						<div className="flex items-center justify-center gap-3">
							<p className="font-mono text-primary text-xs uppercase tracking-[0.16em]">{label}</p>

							<span className="font-mono text-shell-muted text-xs">0{index + 1}</span>
						</div>

						<ul className="mt-5 grid justify-items-center gap-2">
							{links.map(({ href, label: linkLabel }) => (
								<li key={href}>
									<CompactFooterLink href={href} label={linkLabel} />
								</li>
							))}
						</ul>
					</div>
				))}
			</nav>
		</div>

		<div className="relative border-shell-border border-t">
			<div className="mx-auto flex max-w-295 justify-center px-4 py-4 text-center text-s text-shell-muted sm:px-6 lg:px-8">
				<FooterCopyright />
			</div>
		</div>
	</footer>
);

const CompactFooterLink = ({ href, label }: { href: string; label: string }) => (
	<Link
		href={href}
		className="group inline-flex min-h-8 items-center justify-center gap-1 text-m text-shell-foreground/80 outline-none transition-[color] duration-150 hover:text-primary focus-visible:text-primary motion-reduce:transition-none"
	>
		{label}
		<ArrowUpRight
			aria-hidden
			className="size-3 -translate-y-px opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 motion-reduce:transition-none"
		/>
	</Link>
);
