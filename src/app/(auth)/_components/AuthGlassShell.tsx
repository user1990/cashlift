import Link from "next/link";
import { Logo } from "@/modules/marketing/components/Logo";
import { cn } from "@/ui/utils/cn";
import { AuthDotRail } from "./AuthDotRail";

const CONTENT_MIN_HEIGHT_CLASS = {
	default: "min-h-[19.5rem] max-[48rem]:min-h-[20rem]",
	expanded: "min-h-[24.75rem] max-[48rem]:min-h-[26rem]",
} as const;

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
	<div className="relative isolate grid min-h-[calc(100dvh-4rem)] w-[min(calc(100vw-3rem),92rem)] place-items-center overflow-hidden max-[28rem]:min-h-[calc(100dvh-4rem)] max-[28rem]:w-[calc(100vw-2rem)] max-[48rem]:w-[min(calc(100vw-2rem),24.5rem)] max-[28rem]:rounded-2xl">
		<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
			<div className="absolute inset-x-[4%] top-[8%] h-[78%] rounded-[48%] bg-[radial-gradient(ellipse_at_50%_46%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_66%)] opacity-80" />

			<div className="absolute top-[14%] left-[2%] h-[58%] w-[48%] -rotate-6 rounded-[44%_56%_48%_52%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--violet)_24%,transparent),transparent_70%)] opacity-75" />

			<div className="absolute right-[1%] bottom-[9%] h-[54%] w-[50%] rotate-6 rounded-[54%_46%_58%_42%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_70%)] opacity-75" />

			<div className="absolute top-1/2 left-1/2 h-[72%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/5" />
		</div>

		<div className="relative mx-auto grid w-full max-w-[64rem] grid-cols-[minmax(10rem,19.75rem)_minmax(20rem,24.5rem)_minmax(10rem,19.75rem)] items-center justify-center max-[48rem]:grid-cols-[minmax(0,1fr)]">
			<AuthDotRail side="left" />

			<div
				className={cn(
					"relative z-10 flex min-h-[27.375rem] w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-panel/35 px-5 pt-7 pb-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12),0_1.5rem_5rem_rgb(0_0_0_/_0.38)] backdrop-blur-xl backdrop-saturate-[1.12] before:pointer-events-none before:absolute before:top-0 before:right-[10%] before:left-[10%] before:h-px before:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--primary)_42%,transparent),transparent)] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--shell-border)_34%,transparent)] after:content-[''] [&:has([role=status])>a]:invisible",
					size === "expanded" && "min-h-[32.625rem]",
				)}
			>
				<div className="relative z-10 flex justify-center">
					<Logo />
				</div>

				<div
					className={cn(
						"relative z-10 mt-5 grid w-full flex-1 place-items-center max-[28rem]:mt-4 [&>*]:animate-auth-reveal [&>*]:[grid-area:1/1] motion-reduce:[&>*]:animate-none",
						CONTENT_MIN_HEIGHT_CLASS[size],
					)}
				>
					{children}
				</div>

				<Link
					className="ease relative z-10 inline-flex min-h-8 self-center rounded-md px-2 text-muted-foreground text-sm no-underline outline-none transition-[color,box-shadow] duration-150 hover:text-panel-foreground focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_24%,transparent)] max-[48rem]:mt-4 max-[28rem]:min-h-11"
					href={action.href}
					prefetch={false}
				>
					{action.prompt} <span className="ml-1 font-semibold text-primary">{action.label}</span>
				</Link>
			</div>

			<AuthDotRail side="right" />
		</div>
	</div>
);
