import { COMBINATIONS_AND_UNIQUENESS } from "./techniquesAdvanced";
import { LINKS_AND_WINGS } from "./techniquesChains";
import { FISH_AND_FIRST_LINKS } from "./techniquesFish";

/** The ladder, in the order each technique builds on the one before. */
export const TECHNIQUES = [...FISH_AND_FIRST_LINKS, ...LINKS_AND_WINGS, ...COMBINATIONS_AND_UNIQUENESS];

export const findTechnique = (slug: string) => TECHNIQUES.find(technique => technique.slug === slug);
