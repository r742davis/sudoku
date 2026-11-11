import type { Candidates } from "@/lib/sudoku/techniques";

/** One practice puzzle in the shape the engine works with. Each technique's file builds these from its raw board data. */
export interface PracticeBoard {
	/** The puzzle at the moment it gets stuck: 81 digits, row by row, 0 for empty. */
	values: string;
	/** The digit the pattern is about. */
	digit: number;
	/** The pattern's cells, which the player has to find. */
	cells: number[];
	/** Every cell the pattern can remove the digit from. */
	reach: number[];
	/** The placement the pattern unlocks. */
	next: { cell: number; digit: number };
	/** Shown when the pattern is found: why it works and what to remove. May contain {r1c1} references. */
	found: string;
	/** One sentence on which cells the pattern affects. */
	rule: string;
	/** Two hints, from a nudge to naming where the pattern is. */
	hints: [string, string];
}

export interface PracticeSet {
	name: string;
	boards: PracticeBoard[];
	/** One pass of the eliminations a solver makes before reaching for this technique. Returns true if anything changed. */
	prepare: (grid: Candidates) => boolean;
	/** Number of cells in the pattern, or null when it varies and the player presses Check. */
	pickCount: number | null;
	/** Label for the first step. */
	pickStep: string;
	/** Opening message on each board. */
	intro: string;
	/** Explains why a set of picked cells that share `digit` isn't the pattern. */
	diagnose: (candidates: number[], picked: number[], digit: number) => string;
}
