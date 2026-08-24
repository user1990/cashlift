import { Mail, MessageCircle } from "lucide-react";
import { ActionLink } from "./ActionLink";

export const HelpContactPanel = () => (
	<aside className="relative isolate mt-8 overflow-hidden rounded-lg border border-warning/60 bg-warning-subtle/55 p-4 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.07),0_18px_42px_rgb(0_0_0_/_0.22)] backdrop-blur-md before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-r before:from-warning/10 before:via-transparent before:to-primary/5 before:content-[''] sm:p-6">
		<div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex min-w-0 items-start gap-3">
				<span className="grid size-10 shrink-0 place-items-center rounded-md border border-warning/70 bg-warning/10 text-warning">
					<MessageCircle aria-hidden className="size-5" />
				</span>

				<div className="min-w-0">
					<h2 className="font-semibold text-shell-foreground text-xl">Still need help?</h2>

					<p className="mt-1 max-w-xl text-m text-shell-muted leading-6">
						Talk through cash ops for your service team—sales, support, partnerships, and product feedback stay local in
						demo mode.
					</p>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:flex lg:items-center">
				<ContactChannel email="sales@cashlift.example" label="Sales" />

				<ContactChannel email="support@cashlift.example" label="Support" />

				<ActionLink
					href="/contact"
					variant="secondary"
					className="w-full border-warning/70 bg-warning/10 text-warning hover:border-warning hover:bg-warning/15 hover:text-warning sm:col-span-2 lg:w-auto"
				>
					Contact us
				</ActionLink>
			</div>
		</div>
	</aside>
);

function ContactChannel({ email, label }: { email: string; label: string }) {
	return (
		<div className="flex min-w-0 items-center gap-2">
			<Mail aria-hidden className="size-4 shrink-0 text-warning" />

			<div className="min-w-0">
				<p className="text-s text-shell-muted">{label}</p>

				<a
					href={`mailto:${email}`}
					className="break-all text-s text-warning underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-warning/30"
				>
					{email}
				</a>
			</div>
		</div>
	);
}
