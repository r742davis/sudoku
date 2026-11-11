import { PEERS, bitOf, colOf, countBits, rowOf } from "@/lib/sudoku/grid";
import { solve } from "@/lib/sudoku/solver";
import { Candidates } from "@/lib/sudoku/techniques";
import { hasCandidate, ref } from "./describe";
import type { PracticeBoard, PracticeSet } from "./types";

export type PracticePhase = "find" | "eliminate" | "place" | "done";

export interface PracticeMessage {
	tone: "info" | "good" | "bad";
	/** May contain {r1c1} cell references, rendered by RichText. */
	text: string;
}

export interface PracticeState {
	set: PracticeSet;
	board: PracticeBoard;
	solution: number[];
	/** Cells that lose the digit once the pattern is applied. */
	targets: number[];
	values: number[];
	/** One 9-bit candidate mask per cell. */
	candidates: number[];
	/** Pencil marks once the pattern and the simple eliminations that follow it are applied. */
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
	| { type: "check" }
	| { type: "hint" }
	| { type: "clear" }
	| { type: "reset" };

const good = (text: string): PracticeMessage => ({ tone: "good", text });
const bad = (text: string): PracticeMessage => ({ tone: "bad", text });
const info = (text: string): PracticeMessage => ({ tone: "info", text });

export function createPractice(set: PracticeSet, board: PracticeBoard): PracticeState {
	const values = [...board.values].map(Number);
	// Rebuild the pencil marks a solver would have at this point.
	const grid = new Candidates(values);
	while (set.prepare(grid));

	const targets = board.reach.filter(cell => !board.cells.includes(cell) && grid.masks[cell] & bitOf(board.digit));
	const candidates = [...grid.masks];
	for (const cell of targets) grid.remove(cell, bitOf(board.digit));
	while (set.prepare(grid));

	return {
		set,
		board,
		solution: solve(values),
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
		message: info(set.intro),
	};
}

function slip(state: PracticeState, message: PracticeMessage): PracticeState {
	return { ...state, slips: state.slips + 1, message };
}

/** Fixed-size patterns need every cell. Variable ones accept a pick that spans the same rows and columns. */
function matchesPattern(state: PracticeState, picked: number[]) {
	const { cells } = state.board;
	if (!picked.every(cell => cells.includes(cell))) return false;
	if (state.set.pickCount !== null) return picked.length === cells.length;
	const sameLines = (indexOf: (cell: number) => number) =>
		new Set(picked.map(indexOf)).size === new Set(cells.map(indexOf)).size;
	return sameLines(rowOf) && sameLines(colOf);
}

function checkPick(state: PracticeState, picked: number[]): PracticeState {
	const next = { ...state, picked };
	const shared = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit =>
		picked.every(cell => hasCandidate(state.candidates, cell, digit)),
	);
	if (!shared.length) {
		return slip(
			next,
			bad("These cells don't share a candidate. Every cell in the pattern has the same digit pencilled in."),
		);
	}

	if (matchesPattern(state, picked)) {
		const { board } = state;
		const missed = board.cells.filter(cell => !picked.includes(cell));
		const added = missed.length ? ` I added ${missed.map(ref).join(" and ")}, which belong to the pattern too.` : "";
		return {
			...next,
			picked: board.cells,
			phase: "eliminate",
			highlight: board.digit,
			message: good(`${board.found} ${state.targets.length} to find.${added}`),
		};
	}

	const tried = shared.includes(state.highlight) ? state.highlight : shared[0];
	return slip(next, bad(state.set.diagnose(state.candidates, picked, tried)));
}

function pickCell(state: PracticeState, cell: number): PracticeState {
	if (state.values[cell]) {
		return { ...state, message: bad(`${ref(cell)} is already solved. Pattern cells are always open cells.`) };
	}
	if (state.picked.includes(cell)) return { ...state, picked: state.picked.filter(picked => picked !== cell) };

	const { pickCount } = state.set;
	const picked = [...state.picked, cell];
	if (pickCount === null) {
		if (picked.length > 9) return { ...state, message: bad("That's more cells than the pattern can have. Deselect one first.") };
		return { ...state, picked, message: info(`${picked.length} cells picked. Press Check pattern when you're ready.`) };
	}
	if (picked.length >= pickCount) return checkPick(state, picked.slice(-pickCount));
	return { ...state, picked, message: info(`${picked.length} of ${pickCount} cells picked.`) };
}

function removeCandidate(state: PracticeState, cell: number): PracticeState {
	const { board } = state;
	const { digit } = board;
	if (state.values[cell] || state.removed.includes(cell)) return state;
	if (!hasCandidate(state.candidates, cell, digit)) return slip(state, bad(`${ref(cell)} has no ${digit} to remove.`));
	if (board.cells.includes(cell)) {
		return slip(state, bad(`${ref(cell)} is part of the pattern, so it keeps its ${digit}.`));
	}
	if (!state.targets.includes(cell)) {
		return slip(state, bad(`The ${digit} at ${ref(cell)} is out of reach. ${board.rule}`));
	}

	const candidates = [...state.candidates];
	candidates[cell] &= ~bitOf(digit);
	const removed = [...state.removed, cell];
	const left = state.targets.length - removed.length;
	if (left) {
		return { ...state, candidates, removed, message: good(`Removed the ${digit} at ${ref(cell)}. ${left} more to go.`) };
	}

	const { next } = board;
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
			`All ${removed.length} gone. I've also applied the simpler eliminations that follow, and now ${unlocked}. Select it and enter the digit.`,
		),
	};
}

function place(state: PracticeState, digit: number): PracticeState {
	const cell = state.focus;
	if (cell === null || state.values[cell]) {
		return { ...state, message: info("Select an empty cell first, then pick a digit.") };
	}
	if (state.solution[cell] !== digit) return slip(state, bad(`${digit} doesn't belong at ${ref(cell)}.`));

	const values = [...state.values];
	const candidates = [...state.candidates];
	values[cell] = digit;
	candidates[cell] = 0;
	for (const peer of PEERS[cell]) candidates[peer] &= ~bitOf(digit);
	if (cell !== state.board.next.cell) {
		return { ...state, values, candidates, message: good(`${digit} placed at ${ref(cell)}.`) };
	}

	const tally = state.slips ? `with ${state.slips} slip${state.slips > 1 ? "s" : ""}` : "without a slip";
	return {
		...state,
		values,
		candidates,
		phase: "done",
		focus: null,
		message: good(`That's the ${state.set.name} paying off. Board cleared ${tally}.`),
	};
}

function hint(state: PracticeState): PracticeState {
	const { board } = state;
	const { digit } = board;
	if (state.phase === "find") {
		if (state.hints === 0) {
			return {
				...state,
				hints: 1,
				highlight: digit,
				message: info(`Look at the ${digit}s, highlighted now. ${board.hints[0]}`),
			};
		}
		if (state.hints === 1) return { ...state, hints: 2, highlight: digit, message: info(board.hints[1]) };
		return checkPick({ ...state, hints: 3 }, board.cells);
	}
	if (state.phase === "eliminate") {
		const target = state.targets.find(cell => !state.removed.includes(cell));
		if (target === undefined) return state;
		return { ...state, message: info(`Next one to remove: the ${digit} at ${ref(target)}. ${board.rule}`) };
	}
	if (state.phase === "place") {
		const { cell } = board.next;
		return { ...state, focus: cell, message: info(`${ref(cell)} is selected. Its answer is ${board.next.digit}.`) };
	}
	return state;
}

export function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
	switch (action.type) {
		case "reset":
			return createPractice(state.set, state.board);

		case "hint":
			return hint(state);

		case "clear":
			return state.phase === "find"
				? { ...state, picked: [], highlight: 0, message: info("Selection cleared.") }
				: state;

		case "check":
			return state.phase === "find" ? checkPick(state, state.picked) : state;

		case "tapDigit":
			if (state.phase === "place") return place(state, action.digit);
			if (state.phase === "done") return state;
			return { ...state, highlight: state.highlight === action.digit ? 0 : action.digit };

		case "tapCell":
			if (state.phase === "find") return pickCell(state, action.cell);
			if (state.phase === "eliminate") return removeCandidate(state, action.cell);
			if (state.phase === "place") return { ...state, focus: action.cell };
			return state;
	}
}
