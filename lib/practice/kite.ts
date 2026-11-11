import { COLS, ROWS, boxOf, colOf, rowOf } from "@/lib/sudoku/grid";
import { fish, lockedCandidates, subsets } from "@/lib/sudoku/techniques";
import { commonPeers, hasCandidate, ref } from "./describe";
import { KITE_BOARDS } from "./kiteBoards";
import type { PracticeBoard, PracticeSet } from "./types";

/** Raw board data. `joined[0]`–`ends[0]` is the row link and `joined[1]`–`ends[1]` is the column link. */
export interface KiteBoard {
	values: string;
	digit: number;
	/** The two ends that sit in the same box. */
	joined: [number, number];
	/** The two loose ends. One of them holds the digit. */
	ends: [number, number];
	next: { cell: number; digit: number };
}

function toPracticeBoard(board: KiteBoard): PracticeBoard {
	const { digit, joined, ends } = board;
	const tips = `${ref(ends[0])} and ${ref(ends[1])}`;

	return {
		values: board.values,
		digit,
		cells: [...joined, ...ends],
		reach: commonPeers(ends[0], ends[1]),
		next: board.next,
		found: `That's it. ${ref(joined[0])} and ${ref(joined[1])} share box ${boxOf(joined[0]) + 1}, so they can't both be ${digit}. Whichever one isn't, the far end of its string is, which means ${ref(ends[0])} or ${ref(ends[1])} holds a ${digit}. Now tap the ${digit} that sees both of those.`,
		rule: `A kite only removes ${digit} from a cell that sees both loose ends, ${tips}.`,
		hints: [
			`You need one row and one column where ${digit} has exactly two spots, with one end of each in the same box.`,
			`The row link is in row ${rowOf(joined[0]) + 1} and the column link is in column ${colOf(joined[1]) + 1}.`,
		],
	};
}

/** Why four picked cells aren't a working Two-String Kite. */
function diagnose(candidates: number[], picked: number[], digit: number) {
	// Split the four cells into a pair that shares a row and a pair that shares a column.
	const [a, b, c, d] = picked;
	const split = [
		[[a, b], [c, d]],
		[[a, c], [b, d]],
		[[a, d], [b, c]],
	]
		.flatMap(([one, two]) => [
			{ rowPair: one, colPair: two },
			{ rowPair: two, colPair: one },
		])
		.find(
			({ rowPair, colPair }) =>
				rowOf(rowPair[0]) === rowOf(rowPair[1]) && colOf(colPair[0]) === colOf(colPair[1]),
		);
	if (!split) return "A kite is one pair of cells in a row and another pair in a column.";

	const { rowPair, colPair } = split;
	const extraInRow = ROWS[rowOf(rowPair[0])].find(
		cell => hasCandidate(candidates, cell, digit) && !rowPair.includes(cell),
	);
	if (extraInRow !== undefined) {
		return `Row ${rowOf(extraInRow) + 1} also allows ${digit} at ${ref(extraInRow)}, so its two cells aren't a strong link. The row pair has to be the only two spots for ${digit} in that row.`;
	}
	const extraInCol = COLS[colOf(colPair[0])].find(
		cell => hasCandidate(candidates, cell, digit) && !colPair.includes(cell),
	);
	if (extraInCol !== undefined) {
		return `Column ${colOf(extraInCol) + 1} also allows ${digit} at ${ref(extraInCol)}, so its two cells aren't a strong link. The column pair has to be the only two spots for ${digit} in that column.`;
	}

	if (!rowPair.some(x => colPair.some(y => boxOf(x) === boxOf(y)))) {
		return "Both pairs are strong links, but they aren't tied together. One end of the row pair and one end of the column pair have to sit in the same box.";
	}
	return `That is a real kite on ${digit}, but no ${digit} sees both of its loose ends, so it removes nothing. Look for one that does some work.`;
}

export const TWO_STRING_KITE: PracticeSet = {
	name: "Two-String Kite",
	boards: KITE_BOARDS.map(toPracticeBoard),
	// X-Wings and Swordfish are already applied.
	prepare: grid => lockedCandidates(grid) || subsets(grid) || fish(grid, 2) || fish(grid, 3),
	pickCount: 4,
	pickStep: "Tap the four cells of the kite",
	intro: "Highlight a digit, then look for a row and a column where it has exactly two spots each, with one end of the row pair and one end of the column pair in the same box.",
	diagnose,
};
