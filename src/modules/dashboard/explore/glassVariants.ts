import { COCKPIT_ATMOSPHERES } from "./atmospheres";

export type CockpitAtmosphere = keyof typeof COCKPIT_ATMOSPHERES;

const LIQUID_ATMOSPHERES = {
	find: "find",
	outlook: "outlook",
	priority: "priority",
	queue: "queue",
	status: "status",
	support: "support",
} as const satisfies Record<CockpitAtmosphere, CockpitAtmosphere>;

export const LIQUID_GLASS_LOOK = {
	atmosphereClassName: (slot: CockpitAtmosphere) => COCKPIT_ATMOSPHERES[LIQUID_ATMOSPHERES[slot]],
	cardClassName: "shadow-shell",
	overlayActiveClassName: "absolute inset-0 bg-panel/35 backdrop-blur-xl",
	overlayQuietClassName: "absolute inset-0 bg-panel/45 backdrop-blur-xl",
} as const;
