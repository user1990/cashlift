import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { buildResponsiveTypographyUtilities, buildTypographyFontSize, buildTypographyUtilities } from "./theme";

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
} satisfies Config;

export default config;
