import { LoaderCircle } from "lucide-react";
import Link from "next/link";

type AuthStatusCardProps = {
	description: string;
	retryHref?: string;
	variant?: "loading" | "error";
};

export const AuthStatusCard = ({ description, retryHref, variant = "loading" }: AuthStatusCardProps) => (
	<div
		aria-live="polite"
		className="flex min-h-96 w-full max-w-md flex-col items-center justify-center rounded-lg border border-border bg-panel p-6 text-center shadow-panel"
	>
		<div className="mx-auto flex size-10 items-center justify-center rounded-full border border-border bg-shell-elevated text-primary">
			{variant === "loading" ? (
				<LoaderCircle aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
			) : (
				<span aria-hidden className="text-l+">
					!
				</span>
			)}
		</div>

		<p className="mt-4 text-m text-muted-foreground">{description}</p>

		{variant === "error" && retryHref && (
			<div className="mt-6 flex items-center gap-4">
				<a className="font-medium text-primary underline underline-offset-4" href={retryHref}>
					Try again
				</a>

				<Link className="font-medium text-primary underline underline-offset-4" href="/contact">
					Contact support
				</Link>
			</div>
		)}
	</div>
);
