import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FOOTER_LINKS } from "../content";
import { FooterCopyright } from "./FooterCopyright";

const COMPACT_FOOTER_LINKS = FOOTER_LINKS[0].links;

export const CompactFooter = () => (
	<footer className="relative border-shell-border border-t bg-shell">
		<div className="mx-auto max-w-295 px-4 py-4 sm:px-6 lg:px-8">
			<nav
				aria-label="Footer"
				className="mx-auto flex max-w-fit flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl border border-primary-subtle-border bg-shell-elevated/70 px-5 py-4 text-s text-shell-foreground backdrop-blur-md"
			>
				{COMPACT_FOOTER_LINKS.map(({ href, label }) => (
					<Link
						key={href}
						href={href}
						className="group inline-flex min-h-8 items-center justify-center gap-1 text-shell-foreground/80 outline-none transition-[color] duration-150 hover:text-primary focus-visible:text-primary motion-reduce:transition-none"
					>
						{label}
						<ArrowUpRight
							aria-hidden
							className="size-3 -translate-y-px opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 motion-reduce:transition-none"
						/>
					</Link>
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
