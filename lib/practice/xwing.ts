import { COLS, PEERS, ROWS, bitOf, colOf, countBits, rowOf } from "@/lib/sudoku/grid";
import { solve } from "@/lib/sudoku/solver";
import { Candidates, lockedCandidates, subsets } from "@/lib/sudoku/techniques";
import type { XWingBoard } from "./xwingBoards";

export type PracticePhase = "find" | "eliminate" | "place" | "done";

export interface PracticeMessage {
	tone: "info" | "good" | "bad";
	/** May contain {r1c1} cell references, rendered by RichText. */
	text: string;
}

export interface PracticeState {
	board: XWingBoard;
	solution: number[];
	corners: number[];
	targets: number[];
	values: number[];
	/** One 9-bit candidate mask per cell. */
	candidates: number[];
	/** Pencil marks once the X-Wing and the simple eliminations that follow it are applied. */
	candidatesAfter: number[];
	phase: PracticePhase;
	picked: number[];
	removed: number[];
	highlight: number;
	focus: number | null;
	hints: number;
	slips: number;
	message: PracticeMessage;
}

export type PracticeAction =
	| { type: "tapCell"; cell: number }
	| { type: "tapDigit"; digit: number }
	| { type: "hint" }
	| { type: "clear" }
	| { type: "reset" };

const ref = (cell: number) => `{r${rowOf(cell) + 1}c${colOf(cell) + 1}}`;
const lineName = (kind: "row" | "col", index: number) => `${kind === "row" ? "row" : "column"} ${index + 1}`;
const other = (kind: "row" | "col") => (kind === "row" ? "col" : "row");
const good = (text: string): PracticeMessage => ({ tone: "good", text });
const bad = (text: string): PracticeMessage => ({ tone: "bad", text });
const info = (text: string): PracticeMessage => ({ tone: "info", text });

export function createPractice(board: XWingBoard): PracticeState {
	const values = [...board.values].map(Number);
	// Rebuild the pencil marks a solver would have at this point: basic eliminations only.
	const grid = new Candidates(values);
	while (lockedCandidates(grid) || subsets(grid));

	const { digit, kind, lines, cross } = board.xwing;
	const cellAt = (line: number, position: number) => (kind === "row" ? line * 9 + position : position * 9 + line);
	const corners = lines.flatMap(line => cross.map(position => cellAt(line, position)));
	const targets = cross.flatMap(position =>
		(kind === "row" ? COLS : ROWS)[position].filter(
			cell => !corners.includes(cell) && grid.masks[cell] & bitOf(digit)
		)
	);

	const candidates = [...grid.masks];
	for (const cell of targets) grid.remove(cell, bitOf(digit));
	while (lockedCandidates(grid) || subsets(grid));

	return {
		board,
		solution: solve(values),
		corners,
		targets,
		values,
		candidates,
		candidatesAfter: grid.masks,
		phase: "find",
		picked: [],
		removed: [],
		highlight: 0,
		focus: null,
		hints: 0,
		slips: 0,
		message: info(
			"Highlight a digit to see where it can go, then look for two rows (or two columns) where it fits in exactly the same two places."
		),
	};
}

function slip(state: PracticeState, message: PracticeMessage): PracticeState {
	return { ...state, slips: state.slips + 1, message };
}

function describeLines(state: PracticeState) {
	const { kind, lines, cross } = state.board.xwing;
	return {
		base: lines.map(line => lineName(kind, line)).join(" and "),
		cover: cross.map(line => lineName(other(kind), line)).join(" and "),
	};
}

function checkCorners(state: PracticeState, picked: number[]): PracticeState {
	const next = { ...state, picked };
	const rows = [...new Set(picked.map(rowOf))];
	const cols = [...new Set(picked.map(colOf))];
	if (rows.length !== 2 || cols.length !== 2) {
		return slip(
			next,
			bad("Those four cells don't form a rectangle. An X-Wing's corners sit on exactly two rows and two columns.")
		);
	}
	const shared = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit =>
		picked.every(cell => state.candidates[cell] & bitOf(digit))
	);
	if (!shared.length) {
		return slip(
			next,
			bad(
				"Good rectangle, but these four cells don't share a candidate. Every corner needs the same digit pencilled in."
			)
		);
	}

	const { digit } = state.board.xwing;
	if (picked.every(cell => state.corners.includes(cell))) {
		const { base, cover } = describeLines(state);
		return {
			...next,
			phase: "eliminate",
			highlight: digit,
			message: good(
				`That's it. In ${base}, ${digit} only fits in ${cover}, so the corners supply the ${digit} for both. Now tap every other ${digit} in ${cover} to remove it. ${state.targets.length} to find.`
			),
		};
	}

	// Explain why this rectangle fails: find a stray candidate in one of its rows and one of its columns.
	const tried = shared.includes(state.highlight) ? state.highlight : shared[0];
	const stray = (unit: number[], allowed: number[], indexOf: (cell: number) => number) =>
		unit.find(cell => state.candidates[cell] & bitOf(tried) && !allowed.includes(indexOf(cell)));
	const inRow = rows.map(row => stray(ROWS[row], cols, colOf)).find(cell => cell !== undefined);
	const inCol = cols.map(col => stray(COLS[col], rows, rowOf)).find(cell => cell !== undefined);
	if (inRow === undefined || inCol === undefined) {
		return slip(
			next,
			bad(
				`That is a real X-Wing on ${tried}, but it doesn't remove anything here. Look for one that does some work.`
			)
		);
	}
	return slip(
		next,
		bad(
			`On ${tried}, these corners don't lock. Row ${rowOf(inRow) + 1} also allows ${tried} at ${ref(inRow)}, and column ${colOf(inCol) + 1} also allows it at ${ref(inCol)}. One direction has to be clean: both rows with ${tried} only at the corners, or both columns.`
		)
	);
}

function removeCandidate(state: PracticeState, cell: number): PracticeState {
	const { digit } = state.board.xwing;
	if (state.values[cell] || state.removed.includes(cell)) return state;
	if (!(state.candidates[cell] & bitOf(digit))) return slip(state, bad(`${ref(cell)} has no ${digit} to remove.`));
	if (state.corners.includes(cell)) {
		return slip(
			state,
			bad(`${ref(cell)} is a corner. Corners keep their ${digit}; one diagonal pair of them will hold it.`)
		);
	}
	if (!state.targets.includes(cell)) {
		return slip(
			state,
			bad(
				`The ${digit} at ${ref(cell)} isn't in ${describeLines(state).cover.replace(" and ", " or ")}, so the X-Wing can't reach it.`
			)
		);
	}

	const candidates = [...state.candidates];
	candidates[cell] &= ~bitOf(digit);
	const removed = [...state.removed, cell];
	const left = state.targets.length - removed.length;
	if (left)
		return {
			...state,
			candidates,
			removed,
			message: good(`Removed the ${digit} at ${ref(cell)}. ${left} more to go.`),
		};

	const { next } = state.board;
	const unlocked =
		countBits(state.candidatesAfter[next.cell]) === 1
			? `${ref(next.cell)} is down to a single candidate`
			: `${ref(next.cell)} is the only place left for one of its digits in a row, column or box`;
	return {
		...state,
		candidates: state.candidatesAfter,
		removed,
		phase: "place",
		highlight: 0,
		message: good(
			`All ${removed.length} gone. I've also applied the pair and pointing eliminations that follow, and now ${unlocked}. Select it and enter the digit.`
		),
	};
}

function place(state: PracticeState, digit: number): PracticeState {
	const cell = state.focus;
	if (cell === null || state.values[cell])
		return { ...state, message: info("Select an empty cell first, then pick a digit.") };
	if (state.solution[cell] !== digit) return slip(state, bad(`${digit} doesn't belong at ${ref(cell)}.`));

	const values = [...state.values];
	const candidates = [...state.candidates];
	values[cell] = digit;
	candidates[cell] = 0;
	for (const peer of PEERS[cell]) candidates[peer] &= ~bitOf(digit);
	if (cell !== state.board.next.cell)
		return { ...state, values, candidates, message: good(`${digit} placed at ${ref(cell)}.`) };
	return {
		...state,
		values,
		candidates,
		phase: "done",
		focus: null,
		message: good(
			state.slips
				? `That's the X-Wing paying off. Board cleared with ${state.slips} slip${state.slips > 1 ? "s" : ""}.`
				: "That's the X-Wing paying off. Board cleared without a slip."
		),
	};
}

function hint(state: PracticeState): PracticeState {
	const { digit, kind, lines } = state.board.xwing;
	if (state.phase === "find") {
		if (state.hints === 0) {
			return {
				...state,
				hints: 1,
				highlight: digit,
				message: info(
					`Look at the ${digit}s, highlighted now. Check the rows and columns where ${digit} appears exactly twice.`
				),
			};
		}
		if (state.hints === 1) {
			return {
				...state,
				hints: 2,
				highlight: digit,
				message: info(`The pattern lives in ${describeLines(state).base}. Where does ${digit} fit in each?`),
			};
		}
		return checkCorners({ ...state, hints: 3 }, state.corners);
	}
	if (state.phase === "eliminate") {
		const target = state.targets.find(cell => !state.removed.includes(cell));
		return target === undefined
			? state
			: {
					...state,
					message: info(
						`Next one to remove: the ${digit} at ${ref(target)}. It shares ${lineName(other(kind), kind === "row" ? colOf(target) : rowOf(target))} with two corners but isn't in ${lines.map(line => lineName(kind, line)).join(" or ")}.`
					),
				};
	}
	if (state.phase === "place") {
		const { cell } = state.board.next;
		return {
			...state,
			focus: cell,
			message: info(`${ref(cell)} is selected. Its answer is ${state.board.next.digit}.`),
		};
	}
	return state;
}

export function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
	switch (action.type) {
		case "reset":
			return createPractice(state.board);

		case "hint":
			return hint(state);

		case "clear":
			return state.phase === "find"
				? { ...state, picked: [], highlight: 0, message: info("Selection cleared.") }
				: state;

		case "tapDigit":
			if (state.phase === "place") return place(state, action.digit);
			if (state.phase === "done") return state;
			return { ...state, highlight: state.highlight === action.digit ? 0 : action.digit };

		case "tapCell": {
			const { cell } = action;
			if (state.phase === "eliminate") return removeCandidate(state, cell);
			if (state.phase === "place") return { ...state, focus: cell };
			if (state.phase === "done") return state;
			if (state.values[cell])
				return { ...state, message: bad(`${ref(cell)} is already solved. Corners are always open cells.`) };
			if (state.picked.includes(cell))
				return { ...state, picked: state.picked.filter(picked => picked !== cell) };
			const picked = [...state.picked, cell];
			if (picked.length === 4) return checkCorners(state, picked);
			if (picked.length > 4) return checkCorners(state, picked.slice(-4));
			return { ...state, picked, message: info(`${picked.length} of 4 corners picked.`) };
		}
	}
}
