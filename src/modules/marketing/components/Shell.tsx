import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FooterAccordion } from "./FooterAccordion";
import { FooterCopyright } from "./FooterCopyright";
import { Header } from "./Header";

type ShellProps = {
	children: React.ReactNode;
};

export const Shell = ({ children }: ShellProps) => (
	<div className="flex min-h-screen w-full min-w-0 flex-col bg-shell text-shell-foreground">
		<Header />

		{children}

		<footer className="relative isolate mt-auto overflow-hidden border-shell-border border-t bg-shell">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgb(2_218_235_/_0.14),transparent_30%),radial-gradient(circle_at_18%_88%,rgb(99_44_151_/_0.2),transparent_34%)]"
			/>

			<div className="pointer-events-none absolute top-8 left-1/2 size-64 -translate-x-1/2 rounded-full border border-primary/10 sm:size-80" />

			<div className="pointer-events-none absolute top-16 left-1/2 size-48 -translate-x-1/2 rounded-full border border-primary/15 sm:size-60" />

			<div className="relative mx-auto max-w-295 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
				<section className="mx-auto max-w-xl text-center">
					<p className="font-mono text-primary text-xs uppercase tracking-[0.18em]">Cash operations, made visible</p>

					<h2 className="mt-4 text-4xl+ text-shell-foreground tracking-normal sm:text-5xl+">See cash clearly.</h2>

					<p className="mx-auto mt-3 max-w-sm text-m text-shell-muted leading-6">
						A calmer way to move through the system.
					</p>

					<Link
						href="/demo"
						className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 font-semibold text-m text-primary-foreground shadow-primary-glow transition-[background-color,box-shadow] duration-150 hover:bg-primary-hover hover:shadow-primary-glow focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 motion-reduce:transition-none"
					>
						Open live demo
						<ArrowUpRight aria-hidden className="size-4" />
					</Link>
				</section>

				<div className="mt-10">
					<FooterAccordion />
				</div>
			</div>

			<div className="relative border-shell-border border-t">
				<div className="mx-auto flex max-w-295 justify-center px-4 py-5 text-center text-s text-shell-muted sm:px-6 lg:px-8">
					<FooterCopyright />
				</div>
			</div>
		</footer>
	</div>
);
