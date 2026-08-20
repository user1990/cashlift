import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/ui/utils/cn";

type AccountMenuShellProps = {
	avatar: string;
	compact?: boolean;
	description: string;
	items: { href: string; label: string }[];
	name: string;
	placement?: "header" | "sidebar";
	signOut?: () => void;
};

const MENU_ITEM_CLASS_NAME =
	"flex cursor-pointer items-center rounded-md px-3 py-2 text-left text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel-muted hover:text-shell-foreground focus-visible:bg-panel-muted focus-visible:text-shell-foreground";

export const AccountMenuShell = ({
	avatar,
	compact = false,
	description,
	items,
	name,
	placement = "sidebar",
	signOut,
}: AccountMenuShellProps) => (
	<details className={cn("relative", placement === "header" && "shrink-0")}>
		<summary
			aria-label={compact ? `${name}, ${description}` : undefined}
			className={cn(
				"ease flex cursor-pointer list-none items-center rounded-lg text-left text-shell-foreground transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden",
				compact ? "size-11 justify-center p-0" : "w-full gap-3 px-2 py-3",
			)}
		>
			<span
				aria-hidden={compact}
				className="grid size-10 shrink-0 place-items-center rounded-full bg-panel-muted font-semibold text-s+ text-shell-foreground"
			>
				{avatar}
			</span>

			{!compact && (
				<>
					<span className="min-w-0 flex-1">
						<span className="block truncate font-semibold text-m+">{name}</span>

						<span className="block truncate text-s text-shell-muted">{description}</span>
					</span>

					<ChevronDown aria-hidden className="size-4 text-shell-muted" />
				</>
			)}
		</summary>

		<div
			className={cn(
				"absolute z-20 grid w-56 gap-1 rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell",
				placement === "header" ? "top-full right-0 mt-2" : "bottom-full left-0 mb-2",
			)}
		>
			{compact && (
				<div className="border-shell-border border-b px-3 py-2">
					<p className="truncate font-semibold text-m+ text-shell-foreground">{name}</p>

					<p className="truncate text-s text-shell-muted">{description}</p>
				</div>
			)}

			{items.map(({ href, label }) => (
				<Link key={href} className={MENU_ITEM_CLASS_NAME} href={href}>
					{label}
				</Link>
			))}

			{signOut && (
				<button className={MENU_ITEM_CLASS_NAME} onClick={signOut} type="button">
					Sign out
				</button>
			)}
		</div>
	</details>
);
