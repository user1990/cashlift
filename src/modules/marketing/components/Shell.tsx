import Link from "next/link";
import { FOOTER_LINKS } from "../content";
import { Header } from "./Header";

type ShellProps = {
	children: React.ReactNode;
};

export const Shell = ({ children }: ShellProps) => (
	<div className="flex min-h-screen flex-col bg-shell text-shell-foreground">
		<Header />

		{children}

		<footer className="mt-auto border-t border-shell-border bg-shell-elevated">
			<div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_1.9fr] lg:px-8">
				<section>
					<p className="text-s+ uppercase tracking-normal text-primary">Kuvro</p>

					<h2 className="mt-2 max-w-sm text-3xl+ tracking-normal text-shell-foreground">
						Run your first cash leak audit in minutes.
					</h2>

					<p className="mt-3 max-w-md text-m leading-6 text-shell-muted">
						Kuvro is a demo-first MVP for service firms that want company spend decisions tied to cash impact.
					</p>
				</section>

				<nav aria-label="Footer">
					<ul className="grid gap-6 sm:grid-cols-4">
						{FOOTER_LINKS.map(({ label, links }) => (
							<li key={label}>
								<p className="text-m+ text-shell-foreground">{label}</p>

								<ul className="mt-3 flex flex-col gap-2">
									{links.map(({ href, label: linkLabel }) => (
										<li key={href}>
											<Link
												href={href}
												className="text-m text-shell-muted transition-colors duration-150 hover:text-primary"
											>
												{linkLabel}
											</Link>
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	</div>
);
