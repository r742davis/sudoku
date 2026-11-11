import { COLS, ROWS, colOf, rowOf } from "@/lib/sudoku/grid";
import type { Candidates } from "@/lib/sudoku/techniques";
import { hasCandidate, joinWords, lineName, ref } from "./describe";
import type { PracticeBoard, PracticeSet } from "./types";

/** Raw board data for X-Wing (two lines) and Swordfish (three lines). */
export interface FishBoard {
	values: string;
	digit: number;
	/** Whether the base lines are rows or columns. */
	kind: "row" | "col";
	/** The base lines, zero-based. */
	lines: number[];
	/** The lines that cross them and get cleared, zero-based. */
	cross: number[];
	cells: number[];
	next: { cell: number; digit: number };
}

interface FishOptions {
	name: string;
	/** 2 for X-Wing, 3 for Swordfish. */
	size: 2 | 3;
	boards: FishBoard[];
	prepare: (grid: Candidates) => boolean;
	pickStep: string;
	intro: string;
}

const COUNT = { 2: "two", 3: "three" };

function toPracticeBoard(name: string, size: 2 | 3, board: FishBoard): PracticeBoard {
	const { digit, kind, lines, cross } = board;
	const coverKind = kind === "row" ? "col" : "row";
	const base = joinWords(lines.map(line => lineName(kind, line)));
	const cover = joinWords(cross.map(line => lineName(coverKind, line)));
	const coverLines = kind === "row" ? COLS : ROWS;
	const inBase = (cell: number) => lines.includes(kind === "row" ? rowOf(cell) : colOf(cell));

	return {
		values: board.values,
		digit,
		cells: board.cells,
		reach: cross.flatMap(line => coverLines[line].filter(cell => !inBase(cell))),
		next: board.next,
		found: `That's it. In ${base}, every ${digit} sits inside ${cover}. ${size === 2 ? "Two" : "Three"} lines need ${COUNT[size]} ${digit}s and can't share a ${kind === "row" ? "column" : "row"}, so those ${COUNT[size]} ${kind === "row" ? "columns" : "rows"} are spoken for. Now tap every other ${digit} in ${cover} to remove it.`,
		rule: `This ${name} only clears ${cover}, outside ${base}.`,
		hints: [
			`Check the rows and columns where ${digit} has ${size === 2 ? "exactly two" : "only two or three"} spots.`,
			`The pattern lives in ${base}. Which ${kind === "row" ? "columns" : "rows"} do their ${digit}s use?`,
		],
	};
}

/** Why a pick isn't a working fish: wrong shape, or a line that still has a stray candidate. */
function diagnoseFish(name: string, size: 2 | 3) {
	return (candidates: number[], picked: number[], digit: number) => {
		const rows = [...new Set(picked.map(rowOf))];
		const cols = [...new Set(picked.map(colOf))];
		if (picked.length < size * 2) {
			return `A ${name} has ${size === 2 ? "four cells" : "six to nine cells: two or three in each of its three lines"}. You've picked ${picked.length}.`;
		}
		if (rows.length !== size || cols.length !== size) {
			return size === 2
				? "Those four cells don't form a rectangle. An X-Wing's corners sit on exactly two rows and two columns."
				: `Your cells spread over ${rows.length} rows and ${cols.length} columns. A Swordfish fits inside exactly three of each.`;
		}

		// A stray is the digit sitting in one of the picked lines but outside the crossing lines.
		const stray = (lines: number[][], own: number[], allowed: number[], indexOf: (cell: number) => number) =>
			own
				.flatMap(line => lines[line])
				.find(cell => hasCandidate(candidates, cell, digit) && !allowed.includes(indexOf(cell)));
		const inRow = stray(ROWS, rows, cols, colOf);
		const inCol = stray(COLS, cols, rows, rowOf);
		if (inRow === undefined || inCol === undefined) {
			return `That is a real ${name} on ${digit}, but it doesn't remove anything here. Look for one that does some work.`;
		}
		return `On ${digit}, these lines don't lock. Row ${rowOf(inRow) + 1} also allows ${digit} at ${ref(inRow)}, outside your columns, and column ${colOf(inCol) + 1} also allows it at ${ref(inCol)}, outside your rows. One direction has to be clean: ${COUNT[size]} rows with every ${digit} inside the same ${COUNT[size]} columns, or the reverse.`;
	};
}

export function fishPractice({ name, size, boards, prepare, pickStep, intro }: FishOptions): PracticeSet {
	return {
		name,
		boards: boards.map(board => toPracticeBoard(name, size, board)),
		prepare,
		pickCount: size === 2 ? 4 : null,
		pickStep,
		intro,
		diagnose: diagnoseFish(name, size),
	};
}
