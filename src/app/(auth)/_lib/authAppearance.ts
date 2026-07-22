const AUTH_FOCUS_OUTLINE = {
	outline: "2px solid color-mix(in srgb, var(--primary) 72%, white) !important",
	outlineOffset: "2px !important",
} as const;

export const AUTH_APPEARANCE = {
	options: { logoPlacement: "none" },
	variables: {
		borderRadius: "0.375rem",
		colorBackground: "transparent",
		colorBorder: "var(--border-strong)",
		colorForeground: "var(--panel-foreground)",
		colorInput: "color-mix(in srgb, var(--shell-elevated) 50%, transparent)",
		colorInputForeground: "var(--panel-foreground)",
		colorMuted: "color-mix(in srgb, var(--panel-muted) 50%, transparent)",
		colorMutedForeground: "var(--muted-foreground)",
		colorPrimary: "var(--primary)",
		colorPrimaryForeground: "var(--primary-foreground)",
		colorRing: "var(--primary)",
	},
	elements: {
		card: { background: "transparent", border: 0, boxShadow: "none", padding: 0 },
		cardBox: { boxShadow: "none", width: "100%" },
		footer: { display: "none" },
		formFieldInput: {
			border: "1px solid transparent !important",
			boxShadow: "inset 0 0 0 1px var(--border-strong) !important",
			boxSizing: "border-box",
			"@media (max-width: 48rem)": { fontSize: "1rem", minHeight: "2.75rem" },
			"&:focus": {
				borderColor: "transparent !important",
				boxShadow: "inset 0 0 0 1px var(--primary) !important",
				outline: "none !important",
			},
			"&:focus-visible": {
				borderColor: "transparent !important",
				boxShadow: "inset 0 0 0 1px var(--primary) !important",
				...AUTH_FOCUS_OUTLINE,
			},
		},
		formFieldInputShowPasswordButton: {
			"&:focus-visible": {
				boxShadow: "none !important",
				...AUTH_FOCUS_OUTLINE,
			},
		},
		formButtonPrimary: {
			borderRadius: "9999px !important",
			boxShadow: "inset 0 0 0 1px var(--primary) !important",
			overflow: "hidden",
			"@media (max-width: 48rem)": { minHeight: "2.75rem" },
			"&:focus-visible": AUTH_FOCUS_OUTLINE,
		},
		rootBox: { width: "100%" },
		socialButtonsBlockButton: {
			background: "color-mix(in srgb, var(--shell-elevated) 50%, transparent)",
			borderColor: "var(--shell-border)",
			"&:focus-visible": {
				boxShadow: "none !important",
				...AUTH_FOCUS_OUTLINE,
			},
		},
	},
} as const;
