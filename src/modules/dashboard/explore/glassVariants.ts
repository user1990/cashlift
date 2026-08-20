import { COCKPIT_ATMOSPHERES } from "./atmospheres";

export const GLASS_VARIANT_IDS = ["liquid", "clear", "frost", "depth", "soft"] as const;

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

const LIQUID_ATMOSPHERES = {
	find: "find",
	outlook: "outlook",
	priority: "priority",
	queue: "queue",
	status: "status",
	support: "support",
} as const satisfies Record<CockpitAtmosphere, CockpitAtmosphere>;

const LEGACY_GLASS_VARIANTS = {
	crystal: "clear",
	shift: "soft",
} as const;

export const GLASS_VARIANTS = {
	clear: {
		atmosphereClassName: getAtmosphereClassName(LIQUID_ATMOSPHERES, "saturate-110 contrast-105"),
		cardClassName: "shadow-shell",
		label: "Clear",
		overlayActiveClassName: "absolute inset-0 bg-panel/20 backdrop-blur-lg",
		overlayQuietClassName: "absolute inset-0 bg-panel/28 backdrop-blur-lg",
	},
	depth: {
		atmosphereClassName: getAtmosphereClassName(LIQUID_ATMOSPHERES),
		cardClassName: "shadow-[0_22px_62px_rgb(0_0_0/0.44)]",
		label: "Depth",
		overlayActiveClassName: "absolute inset-0 bg-panel/38 backdrop-blur-xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/46 backdrop-blur-xl",
	},
	frost: {
		atmosphereClassName: getAtmosphereClassName(LIQUID_ATMOSPHERES, "brightness-105 saturate-90"),
		cardClassName: "shadow-shell",
		label: "Frost",
		overlayActiveClassName: "absolute inset-0 bg-panel/42 backdrop-blur-xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/50 backdrop-blur-xl",
	},
	liquid: {
		atmosphereClassName: getAtmosphereClassName(LIQUID_ATMOSPHERES),
		cardClassName: "shadow-shell",
		label: "Liquid",
		overlayActiveClassName: "absolute inset-0 bg-panel/35 backdrop-blur-xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/45 backdrop-blur-xl",
	},
	soft: {
		atmosphereClassName: getAtmosphereClassName(LIQUID_ATMOSPHERES),
		cardClassName: "shadow-shell",
		label: "Soft",
		overlayActiveClassName: "absolute inset-0 bg-panel/32 backdrop-blur-2xl",
		overlayQuietClassName: "absolute inset-0 bg-panel/40 backdrop-blur-2xl",
	},
} as const satisfies Record<GlassVariantId, GlassVariant>;

export const isGlassVariantId = (value: string): value is GlassVariantId => {
	if (GLASS_VARIANT_IDS.includes(value as GlassVariantId)) {
		return true;
	}

	return value in LEGACY_GLASS_VARIANTS;
};

export const resolveGlassVariantId = (value: string): GlassVariantId => {
	if (GLASS_VARIANT_IDS.includes(value as GlassVariantId)) {
		return value as GlassVariantId;
	}

	const legacyVariant = LEGACY_GLASS_VARIANTS[value as keyof typeof LEGACY_GLASS_VARIANTS];

	return legacyVariant ?? DEFAULT_GLASS_VARIANT;
};

function getAtmosphereClassName(slots: Record<CockpitAtmosphere, CockpitAtmosphere>, filterClassName?: string) {
	return (slot: CockpitAtmosphere) =>
		filterClassName ? `${COCKPIT_ATMOSPHERES[slots[slot]]} ${filterClassName}` : COCKPIT_ATMOSPHERES[slots[slot]];
}
