import { tv } from "tailwind-variants";

export const buttonVariants = tv({
	base: "focus-ring-rac inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-duration-micro)] ease data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:scale-[var(--motion-press-scale)] motion-reduce:data-pressed:scale-100",
	defaultVariants: {
		size: "default",
		variant: "secondary",
	},
	variants: {
		size: {
			default: "h-9 px-3 text-[0.875rem] leading-5",
			large: "h-11 px-4 text-[0.875rem] leading-5",
			small: "h-8 px-2.5 text-[0.75rem] leading-4",
		},
		variant: {
			ghost: "border border-transparent text-muted-foreground hover:bg-panel-muted hover:text-panel-foreground",
			link: "focus-ring font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline active:scale-100",
			primary:
				"border border-primary/80 bg-primary text-primary-foreground shadow-primary-glow hover:border-primary-hover hover:bg-primary-hover",
			secondary:
				"border border-shell-border bg-shell-elevated text-shell-foreground hover:border-primary-subtle-border hover:text-primary",
			success:
				"border border-signal/80 bg-signal text-primary-foreground shadow-[0_10px_24px_rgb(34_199_122/0.18)] hover:border-signal hover:bg-signal/90",
		},
	},
});
