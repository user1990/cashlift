import { COCKPIT_ATMOSPHERES } from "./atmospheres";

export const GLASS_VARIANT_IDS = ["liquid", "frost", "crystal", "depth", "shift"] as const;

export type GlassVariantId = (typeof GLASS_VARIANT_IDS)[number];

export type CockpitAtmosphere = keyof typeof COCKPIT_ATMOSPHERES;

type GlassVariant = {
	atmosphereClassName: (slot: CockpitAtmosphere) => string;
	cardClassName: string;
	label: string;
	overlayActiveClassName: string;
	overlayQuietClassName: string;
};

export const DEFAULT_GLASS_VARIANT: GlassVariantId = "liquid";

const IDENTITY_ATMOSPHERES = {
	find: "find",
	outlook: "outlook",
	priority: "priority",
	queue: "queue",
	status: "status",
	support: "support",
} as const satisfies Record<CockpitAtmosphere, CockpitAtmosphere>;

const SHIFT_ATMOSPHERES = {
	find: "priority",
	outlook: "status",
	priority: "outlook",
	queue: "support",
	status: "support",
	support: "queue",
} as const satisfies Record<CockpitAtmosphere, CockpitAtmosphere>;

export const GLASS_VARIANTS = {
	crystal: {
		atmosphereClassName: getAtmosphereClassName(IDENTITY_ATMOSPHERES, "contrast-125 saturate-125"),
		cardClassName: "shadow-[0_8px_28px_rgb(0_0_0/0.28)]",
		label: "Crystal",
		overlayActiveClassName: "absolute inset-0 bg-panel/18 backdrop-blur-md",
		overlayQuietClassName: "absolute inset-0 bg-panel/24 backdrop-blur-md",
	},
	depth: {
		atmosphereClassName: getAtmosphereClassName(IDENTITY_ATMOSPHERES, "brightness-75"),
		cardClassName: "shadow-[0_36px_80px_rgb(0_0_0/0.58)]",
		label: "Depth",
		overlayActiveClassName: "absolute inset-0 bg-panel/58 backdrop-blur-2xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/68 backdrop-blur-2xl",
	},
	frost: {
		atmosphereClassName: getAtmosphereClassName(IDENTITY_ATMOSPHERES, "brightness-110 saturate-50"),
		cardClassName: "shadow-[0_28px_90px_rgb(148_163_184/0.22)]",
		label: "Frost",
		overlayActiveClassName: "absolute inset-0 bg-panel/52 backdrop-blur-3xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/62 backdrop-blur-3xl",
	},
	liquid: {
		atmosphereClassName: getAtmosphereClassName(IDENTITY_ATMOSPHERES),
		cardClassName: "shadow-shell",
		label: "Liquid",
		overlayActiveClassName: "absolute inset-0 bg-panel/35 backdrop-blur-xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/45 backdrop-blur-xl",
	},
	shift: {
		atmosphereClassName: getAtmosphereClassName(SHIFT_ATMOSPHERES),
		cardClassName: "shadow-[0_20px_55px_rgb(56_189_248/0.16)]",
		label: "Shift",
		overlayActiveClassName: "absolute inset-0 bg-panel/30 backdrop-blur-xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/40 backdrop-blur-xl",
	},
} as const satisfies Record<GlassVariantId, GlassVariant>;

export const isGlassVariantId = (value: string): value is GlassVariantId =>
	GLASS_VARIANT_IDS.includes(value as GlassVariantId);

function getAtmosphereClassName(slots: Record<CockpitAtmosphere, CockpitAtmosphere>, filterClassName?: string) {
	return (slot: CockpitAtmosphere) =>
		filterClassName ? `${COCKPIT_ATMOSPHERES[slots[slot]]} ${filterClassName}` : COCKPIT_ATMOSPHERES[slots[slot]];
}
