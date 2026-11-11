import { COLS, ROWS, colOf, rowOf } from "@/lib/sudoku/grid";
import { fish, lockedCandidates, subsets } from "@/lib/sudoku/techniques";
import { commonPeers, groupBy, hasCandidate, lineName, ref } from "./describe";
import { SKYSCRAPER_BOARDS } from "./skyscraperBoards";
import type { PracticeBoard, PracticeSet } from "./types";

/** Raw board data. `base[0]`–`tops[0]` and `base[1]`–`tops[1]` are the two strong links. */
export interface SkyscraperBoard {
	values: string;
	digit: number;
	/** The two ends that share a row or column. */
	base: [number, number];
	/** The two ends that don't line up. One of them holds the digit. */
	tops: [number, number];
	next: { cell: number; digit: number };
}

function toPracticeBoard(board: SkyscraperBoard): PracticeBoard {
	const { digit, base, tops } = board;
	// Links that run down columns have their base in a shared row, and the other way around.
	const linkKind = colOf(base[0]) === colOf(tops[0]) ? "col" : "row";
	const baseLine =
		linkKind === "col" ? lineName("row", rowOf(base[0])) : lineName("col", colOf(base[0]));
	const tips = `${ref(tops[0])} and ${ref(tops[1])}`;

	return {
		values: board.values,
		digit,
		cells: [...base, ...tops],
		reach: commonPeers(tops[0], tops[1]),
		next: board.next,
		found: `That's it. ${ref(base[0])} and ${ref(base[1])} share ${baseLine}, so they can't both be ${digit}. Whichever one isn't, the other end of its link is, which means ${ref(tops[0])} or ${ref(tops[1])} holds a ${digit}. Now tap every ${digit} that sees both of those.`,
		rule: `A Skyscraper only removes ${digit} from cells that see both tops, ${tips}.`,
		hints: [
			`Find the ${linkKind === "col" ? "columns" : "rows"} where ${digit} has exactly two spots. You need two of them with one end of each lined up.`,
			`The two links run from ${ref(base[0])} to ${ref(tops[0])} and from ${ref(base[1])} to ${ref(tops[1])}.`,
		],
	};
}

/** Why four picked cells aren't a working Skyscraper. */
function diagnose(candidates: number[], picked: number[], digit: number) {
	const pairsIn = (indexOf: (cell: number) => number) => {
		const groups = [...groupBy(picked, indexOf).entries()];
		return groups.length === 2 && groups.every(([, cells]) => cells.length === 2) ? groups : null;
	};
	const inCols = pairsIn(colOf);
	const inRows = pairsIn(rowOf);
	if (inCols && inRows) {
		return "These four cells line up at both ends, which makes a rectangle. That's the X-Wing shape. A Skyscraper lines up at one end only.";
	}
	const pairs = inCols ?? inRows;
	if (!pairs) {
		return "A Skyscraper is two pairs of cells: two in one column and two in another, or the same with rows.";
	}

	const kind = inCols ? "col" : "row";
	for (const [line, cells] of pairs) {
		const extra = (kind === "col" ? COLS : ROWS)[line].find(
			cell => hasCandidate(candidates, cell, digit) && !cells.includes(cell),
		);
		if (extra !== undefined) {
			return `${lineName(kind, line)[0].toUpperCase()}${lineName(kind, line).slice(1)} also allows ${digit} at ${ref(extra)}, so its two cells aren't a strong link. Each pair has to be the only two spots for ${digit} in its ${kind === "col" ? "column" : "row"}.`;
		}
	}

	const across = kind === "col" ? rowOf : colOf;
	const [first, second] = pairs.map(([, cells]) => cells);
	if (!first.some(a => second.some(b => across(a) === across(b)))) {
		return `Both pairs are strong links, but no end of one shares a ${kind === "col" ? "row" : "column"} with an end of the other. That shared line is the base of the Skyscraper.`;
	}
	return `That is a real Skyscraper on ${digit}, but no ${digit} sees both of its tops, so it removes nothing. Look for one that does some work.`;
}

export const SKYSCRAPER: PracticeSet = {
	name: "Skyscraper",
	boards: SKYSCRAPER_BOARDS.map(toPracticeBoard),
	// X-Wings and Swordfish are already applied.
	prepare: grid => lockedCandidates(grid) || subsets(grid) || fish(grid, 2) || fish(grid, 3),
	pickCount: 4,
	pickStep: "Tap the four cells of the Skyscraper",
	intro: "Highlight a digit, then look for two columns (or two rows) where it has exactly two spots each. One end of each pair should share a line and the other ends should not.",
	diagnose,
};
