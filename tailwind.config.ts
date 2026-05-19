type TypographySize = {
	fontSize: string;
	lineHeight: string;
};

type TypographyFontSizeConfig = Record<string, [string, { lineHeight: string; fontWeight: string }]>;
type TypographyUtilityConfig = Record<string, { fontSize: string; lineHeight: string; fontWeight: string }>;
type TypographyResponsiveUtilityConfig = Record<string, TypographyUtilityConfig>;

const plugin: typeof import("tailwindcss/plugin").default = require("tailwindcss/plugin");

const TYPOGRAPHY_WEIGHTS = {
	regular: "400",
	bold: "600",
} as const;

const TYPOGRAPHY_BREAKPOINTS = {
	sm: "40rem",
	md: "48rem",
	lg: "64rem",
	xl: "80rem",
	"2xl": "96rem",
} as const;

const TYPOGRAPHY_SIZES = {
	"2xs": {
		fontSize: "0.6875rem",
		lineHeight: "1rem",
	},
	s: {
		fontSize: "0.75rem",
		lineHeight: "1rem",
	},
	m: {
		fontSize: "0.875rem",
		lineHeight: "1.25rem",
	},
	l: {
		fontSize: "1rem",
		lineHeight: "1.5rem",
	},
	xl: {
		fontSize: "1.125rem",
		lineHeight: "1.75rem",
	},
	"2xl": {
		fontSize: "1.25rem",
		lineHeight: "1.75rem",
	},
	"3xl": {
		fontSize: "1.5rem",
		lineHeight: "2rem",
	},
	"4xl": {
		fontSize: "1.875rem",
		lineHeight: "2.25rem",
	},
	"5xl": {
		fontSize: "2.25rem",
		lineHeight: "2.5rem",
	},
	"6xl": {
		fontSize: "3rem",
		lineHeight: "1",
	},
	"7xl": {
		fontSize: "3.75rem",
		lineHeight: "1",
	},
	"8xl": {
		fontSize: "4.5rem",
		lineHeight: "1",
	},
	"9xl": {
		fontSize: "6rem",
		lineHeight: "1",
	},
	"10xl": {
		fontSize: "8rem",
		lineHeight: "1",
	},
} as const satisfies Record<string, TypographySize>;

const buildTypographyFontSize = (fontWeight: string = TYPOGRAPHY_WEIGHTS.regular): TypographyFontSizeConfig =>
	Object.fromEntries(
		Object.entries(TYPOGRAPHY_SIZES).map(([name, size]) => [
			name,
			[
				size.fontSize,
				{
					lineHeight: size.lineHeight,
					fontWeight,
				},
			],
		]),
	) as TypographyFontSizeConfig;

const buildTypographyUtilities = (fontWeight: string = TYPOGRAPHY_WEIGHTS.bold): TypographyUtilityConfig =>
	Object.fromEntries(
		Object.entries(TYPOGRAPHY_SIZES).map(([name, size]) => [
			`.text-${name}\\+`,
			{
				fontSize: size.fontSize,
				lineHeight: size.lineHeight,
				fontWeight,
			},
		]),
	) as TypographyUtilityConfig;

const escapeBreakpointSelector = (breakpoint: string) =>
	/^\d/.test(breakpoint) ? `\\3${breakpoint[0]} ${breakpoint.slice(1)}` : breakpoint;

const buildResponsiveTypographyUtilities = (
	fontWeight: string = TYPOGRAPHY_WEIGHTS.bold,
): TypographyResponsiveUtilityConfig =>
	Object.fromEntries(
		Object.entries(TYPOGRAPHY_BREAKPOINTS).map(([breakpoint, value]) => [
			`@media (width >= ${value})`,
			Object.fromEntries(
				Object.entries(TYPOGRAPHY_SIZES).map(([name, size]) => [
					`.${escapeBreakpointSelector(breakpoint)}\\:text-${name}\\+`,
					{
						fontSize: size.fontSize,
						lineHeight: size.lineHeight,
						fontWeight,
					},
				]),
			),
		]),
	) as TypographyResponsiveUtilityConfig;

const config = {
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Geist"', '"Geist Fallback"', "ui-sans-serif", "system-ui", "sans-serif"],
				mono: ['"Geist Mono"', '"Geist Mono Fallback"', "ui-monospace", "monospace"],
			},
			fontSize: buildTypographyFontSize(),
		},
	},
	plugins: [
		plugin(({ addBase }) => {
			addBase({
				...buildTypographyUtilities(),
				...buildResponsiveTypographyUtilities(),
			});
		}),
	],
} satisfies import("tailwindcss").Config;

module.exports = config;
