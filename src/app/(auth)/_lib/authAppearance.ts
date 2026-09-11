export const AUTH_APPEARANCE = {
	options: { logoPlacement: "none" },
	variables: {
		borderRadius: "0.5rem",
		colorBackground: "transparent",
		colorBorder: "var(--border-strong)",
		colorForeground: "var(--panel-foreground)",
		colorInput: "color-mix(in srgb, var(--shell-elevated) 72%, transparent)",
		colorInputForeground: "var(--panel-foreground)",
		colorMuted: "color-mix(in srgb, var(--panel-muted) 68%, transparent)",
		colorMutedForeground: "var(--muted-foreground)",
		colorPrimary: "var(--primary)",
		colorPrimaryForeground: "var(--primary-foreground)",
		colorRing: "var(--primary)",
	},
	elements: {
		card: { background: "transparent", border: 0, boxShadow: "none", margin: 0, padding: 0 },
		cardBox: { boxShadow: "none", width: "100%" },
		footer: { display: "none" },
		formFieldInput: {
			border: "1px solid transparent !important",
			boxShadow:
				"inset 0 0 0 1px color-mix(in srgb, var(--border-strong) 78%, transparent), inset 0 1px 0 color-mix(in srgb, var(--foreground) 4%, transparent) !important",
			boxSizing: "border-box",
			"@media (max-width: 48rem)": { fontSize: "1rem", minHeight: "2.75rem" },
			"&:focus": {
				borderColor: "transparent !important",
				boxShadow:
					"inset 0 0 0 1px var(--primary), 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent) !important",
				outline: "none !important",
			},
			"&:focus-visible": {
				borderColor: "transparent !important",
				boxShadow:
					"inset 0 0 0 1px var(--primary), 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent) !important",
				outline: "none !important",
			},
		},
		formButtonPrimary: {
			borderRadius: "9999px !important",
			boxShadow:
				"inset 0 1px 0 color-mix(in srgb, var(--foreground) 24%, transparent), 0 0.625rem 1.875rem color-mix(in srgb, var(--primary) 18%, transparent) !important",
			overflow: "hidden",
			"@media (max-width: 48rem)": { minHeight: "2.75rem" },
			"&:focus-visible": {
				boxShadow:
					"inset 0 0 0 1px color-mix(in srgb, var(--foreground) 36%, transparent), 0 0 0 3px color-mix(in srgb, var(--primary) 24%, transparent) !important",
				outline: "none !important",
			},
		},
		headerSubtitle: { color: "var(--muted-foreground)" },
		headerTitle: { color: "var(--panel-foreground)" },
		rootBox: { width: "100%" },
		socialButtonsBlockButton: {
			background: "color-mix(in srgb, var(--shell-elevated) 78%, var(--panel))",
			border: "1px solid color-mix(in srgb, var(--shell-border) 92%, var(--primary-subtle-border)) !important",
			boxShadow:
				"inset 0 1px 0 color-mix(in srgb, var(--foreground) 10%, transparent), 0 0 0 1px color-mix(in srgb, var(--shell-border) 18%, transparent) !important",
			color: "var(--panel-foreground) !important",
			fontWeight: 600,
			minHeight: "2.75rem",
			transition: "background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
			"&:hover": {
				background: "color-mix(in srgb, var(--shell-elevated) 88%, var(--panel))",
				borderColor: "color-mix(in srgb, var(--primary) 42%, var(--shell-border)) !important",
			},
			"&:focus-visible": {
				boxShadow:
					"inset 0 0 0 1px var(--primary), 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent) !important",
				outline: "2px solid var(--primary) !important",
				outlineOffset: "2px",
			},
		},
	},
} as const;
