"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { cn } from "@/ui/utils/cn";
import { FOOTER_LINKS } from "../content";

export const FooterAccordion = () => {
	const accordionId = useId();
	const [openLabel, setOpenLabel] = useState<string | null>(null);

	return (
		<nav aria-label="Footer" className="relative">
			<div className="lg:hidden">
				{FOOTER_LINKS.map(({ label, links }, index) => {
					const expanded = openLabel === label;
					const panelId = `${accordionId}-panel-${index}`;
					const buttonId = `${accordionId}-button-${index}`;

					return (
						<div
							key={label}
							className={cn(
								"border-shell-border border-b border-l-2",
								expanded && "border-l-primary bg-primary-subtle/15",
							)}
						>
							<button
								id={buttonId}
								aria-controls={panelId}
								aria-expanded={expanded}
								type="button"
								onClick={() => setOpenLabel(expanded ? null : label)}
								className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-shell-foreground outline-none transition-[background-color,color] duration-150 hover:bg-primary/5 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/25 motion-reduce:transition-none"
							>
								<span className="flex items-center gap-3">
									<span className="font-mono text-primary text-xs">0{index + 1}</span>

									<span className="font-medium text-m">{label}</span>
								</span>

								<ChevronDown
									aria-hidden
									className={cn(
										"size-4 shrink-0 text-primary transition-[color,transform] duration-200 ease-out motion-reduce:transition-none",
										expanded && "rotate-180",
									)}
								/>
							</button>

							<section
								id={panelId}
								aria-hidden={!expanded}
								aria-labelledby={buttonId}
								className={cn(
									"ease grid overflow-hidden transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
									expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
								)}
							>
								<div className="min-h-0 overflow-hidden">
									<ul
										className={cn(
											"grid gap-2 pb-5 pl-11 text-m text-shell-muted transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
											expanded ? "translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
										)}
									>
										{links.map(({ href, label: linkLabel }) => (
											<li key={href}>
												<FooterLink href={href} label={linkLabel} />
											</li>
										))}
									</ul>
								</div>
							</section>
						</div>
					);
				})}
			</div>

			<ul className="hidden gap-3 lg:grid lg:grid-cols-4">
				{FOOTER_LINKS.map(({ label, links }, index) => (
					<li key={label} className="rounded-2xl border border-shell-border bg-shell-elevated/70 p-5 backdrop-blur-md">
						<div className="flex items-center justify-between gap-3">
							<p className="font-mono text-primary text-xs uppercase tracking-[0.16em]">{label}</p>

							<span className="font-mono text-shell-muted text-xs">0{index + 1}</span>
						</div>

						<ul className="mt-5 grid gap-2">
							{links.map(({ href, label: linkLabel }) => (
								<li key={href}>
									<FooterLink href={href} label={linkLabel} />
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</nav>
	);
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
	<Link
		href={href}
		className="group inline-flex min-h-8 items-center gap-1 text-m text-shell-foreground/80 outline-none transition-[color] duration-150 hover:text-primary focus-visible:text-primary motion-reduce:transition-none"
	>
		{label}
		<ArrowUpRight
			aria-hidden
			className="size-3 -translate-y-px opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 motion-reduce:transition-none"
		/>
	</Link>
);
