import { Search } from "lucide-react";
import { cn } from "@/ui/utils/cn";

type WorkspaceFindTriggerProps = {
	className?: string;
	onOpen: () => void;
};

export const WorkspaceFindTrigger = ({ className, onOpen }: WorkspaceFindTriggerProps) => (
	<button
		aria-haspopup="dialog"
		className={cn(
			"ease inline-flex h-12 w-full items-center gap-3 rounded-xl border border-white/20 bg-panel/35 px-4 text-left text-m text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] outline-none backdrop-blur-xl transition-[border-color,box-shadow] duration-150 hover:border-white/30 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
			className,
		)}
		onClick={onOpen}
		type="button"
	>
		<Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />

		<span className="min-w-0 flex-1 truncate">Search for anything in this workspace…</span>

		<kbd className="hidden shrink-0 rounded-md border border-shell-border px-1.5 font-mono text-s sm:inline">⌘K</kbd>
	</button>
);
