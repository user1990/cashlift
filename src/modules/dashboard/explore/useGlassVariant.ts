"use client";

import { parseAsString, useQueryState } from "nuqs";
import { DEFAULT_GLASS_VARIANT, type GlassVariantId, isGlassVariantId } from "./glassVariants";

export const useGlassVariant = () => {
	const [rawVariant, setRawVariant] = useQueryState("glass", parseAsString.withDefault(DEFAULT_GLASS_VARIANT));
	const variant: GlassVariantId = isGlassVariantId(rawVariant) ? rawVariant : DEFAULT_GLASS_VARIANT;

	const setVariant = (nextVariant: GlassVariantId) => {
		void setRawVariant(nextVariant);
	};

	return { setVariant, variant };
};
