import { TWO_STRING_KITE } from "./kite";
import { SKYSCRAPER } from "./skyscraper";
import { SWORDFISH } from "./swordfish";
import type { PracticeSet } from "./types";
import { X_WING } from "./xwing";

/** Practice boards, keyed by the technique's slug in the Learn section. */
export const PRACTICE_SETS: Record<string, PracticeSet> = {
	"x-wing": X_WING,
	swordfish: SWORDFISH,
	skyscraper: SKYSCRAPER,
	"two-string-kite": TWO_STRING_KITE,
};

export const PRACTICE_SLUGS = Object.keys(PRACTICE_SETS);
