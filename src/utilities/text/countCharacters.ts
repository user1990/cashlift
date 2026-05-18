const CHARACTER_SEGMENTER = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/**
 * Counts user-visible characters, not UTF-16 code units.
 *
 * Use this for product character limits and counters so emoji sequences,
 * flags, skin-tone modifiers, and combining marks count as users see them.
 *
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
 */
export const countCharacters = (value: string) => [...CHARACTER_SEGMENTER.segment(value)].length;
