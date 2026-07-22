import Link from "next/link";
import { Logo } from "@/modules/marketing/components/Logo";
import { cn } from "@/ui/utils/cn";
import { AuthDotRail } from "./AuthDotRail";

type AuthGlassShellProps = {
	action: {
		href: string;
		label: string;
		prompt: string;
	};
	children: React.ReactNode;
	size?: "default" | "expanded";
};

export const AuthGlassShell = ({ action, children, size = "default" }: AuthGlassShellProps) => (
	<div className="relative grid min-h-[calc(100dvh-4rem)] w-[min(calc(100vw-3rem),92rem)] place-items-center overflow-hidden max-[48rem]:w-[min(calc(100vw-2rem),24.5rem)] max-[28rem]:min-h-[calc(100dvh-4rem)] max-[28rem]:w-[calc(100vw-2rem)] max-[28rem]:rounded-2xl">
		<div className="mx-auto grid w-full max-w-[60.5rem] grid-cols-[minmax(10rem,18rem)_minmax(20rem,24.5rem)_minmax(10rem,18rem)] items-center justify-center max-[48rem]:grid-cols-[minmax(0,1fr)]">
			<AuthDotRail side="left" />

			<div
				className={cn(
					"relative z-1 flex min-h-[27.375rem] w-full flex-col rounded-xl border border-[color-mix(in_srgb,var(--border-strong)_82%,var(--primary-subtle-border))] bg-[color-mix(in_srgb,var(--panel)_50%,transparent)] px-5 pt-7 pb-5 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--foreground)_6%,transparent),0_2rem_4.5rem_rgb(0_0_0_/_0.42)] backdrop-blur-[0.625rem] backdrop-saturate-[1.08] before:absolute before:top-[-1px] before:right-[12%] before:left-[12%] before:h-px before:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--primary)_28%,transparent),transparent)] before:content-[''] [&:has([role=status])>a]:invisible",
					size === "expanded" && "min-h-[32.625rem]",
				)}
			>
				<div className="flex justify-center">
					<Logo />
				</div>

				<div className="mt-5 grid min-h-[16.5rem] w-full flex-1 place-items-center [&>*]:[grid-area:1/1] [&>*]:animate-auth-reveal motion-reduce:[&>*]:animate-none max-[28rem]:mt-4">
					{children}
				</div>

				<Link
					className="inline-flex min-h-8 self-center rounded-md px-2 text-sm text-muted-foreground no-underline outline-none transition-[color] duration-150 ease hover:text-panel-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--primary)] max-[48rem]:mt-4 max-[28rem]:min-h-11"
					href={action.href}
					prefetch={false}
				>
					{action.prompt} <span className="ml-1 text-primary font-semibold">{action.label}</span>
				</Link>
			</div>

			<AuthDotRail side="right" />
		</div>
	</div>
);
