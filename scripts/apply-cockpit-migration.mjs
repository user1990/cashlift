import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reps = [
	[/\/modules\/page-shell\/components\/MainContent/g, "/ui/components/layout/MainContent"],
	[/\/modules\/page-shell\/components\/ShellContainer/g, "/ui/components/layout/ShellContainer"],
	[/\/modules\/page-shell\/components\/ShellSection/g, "/ui/components/layout/ShellSection"],
	[/\/modules\/dashboard\/explore\//g, "/modules/dashboard/cockpits/"],
	[/\.\.\/explore\//g, "../cockpits/"],
	[/from "\.\/exploreUi"/g, 'from "./cockpitUi"'],
	[/from "\.\/GlassCard"/g, 'from "@/ui/components/cockpit/GlassCard"'],
	[/from "\.\.\/vendorsPresentation"/g, 'from "@/modules/vendors/presentation"'],
	[/from "\.\.\/settingsPresentation"/g, 'from "@/modules/workspace/settingsPresentation"'],
	[/from "@\/app\/logo\.svg"/g, 'from "@/ui/assets/logo.svg"'],
	[/InvoicesCockpitPrototype/g, "InvoicesCockpit"],
	[/from "\.\/find\/useFindSession"/g, 'from "./find/hooks/useFindSession"'],
	[/cockpits\/exploreUi/g, "cockpits/cockpitUi"],
	[/cockpits\/GlassCard/g, "ui/components/cockpit/GlassCard"],
	[/modules\/dashboard\/ui\/components/g, "ui/components"],
];

const walk = (directory) => {
	for (const entry of readdirSync(directory)) {
		const path = join(directory, entry);
		const stats = statSync(path);

		if (stats.isDirectory()) {
			if (entry === "node_modules" || entry === ".git") {
				continue;
			}

			walk(path);
			continue;
		}

		if (!/\.(ts|tsx|md)$/.test(path)) {
			continue;
		}

		let source = readFileSync(path, "utf8");
		const original = source;

		for (const [pattern, replacement] of reps) {
			source = source.replace(pattern, replacement);
		}

		if (source !== original) {
			writeFileSync(path, source);
		}
	}
};

walk("src");
