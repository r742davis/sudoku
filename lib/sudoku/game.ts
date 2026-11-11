import { PEERS, bitOf, colOf, rowOf } from "./grid";
import { MAX_MISTAKES, type GameState, type Puzzle } from "./types";

export type GameAction =
	| { type: "selectCell"; cell: number }
	| { type: "moveSelection"; rows: number; cols: number }
	| { type: "clearSelection" }
	| { type: "pressDigit"; digit: number }
	| { type: "lockDigit"; digit: number }
	| { type: "erase" }
	| { type: "undo" }
	| { type: "toggleNotes" }
	| { type: "togglePause" }
	| { type: "tick" }
	| { type: "restart" };

export function createGame(puzzle: Puzzle): GameState {
	return {
		puzzle,
		values: [...puzzle.givens],
		notes: new Array<number>(81).fill(0),
		selected: null,
		lockedDigit: null,
		notesMode: false,
		mistakes: 0,
		elapsed: 0,
		paused: false,
		status: "playing",
		history: [],
		startedOn: new Date().toISOString(),
	};
}

/** Givens and correctly solved cells can't be changed. */
export function isFixed(state: GameState, cell: number) {
	return state.values[cell] === state.puzzle.solution[cell];
}

function enterDigit(state: GameState, cell: number, digit: number): GameState {
	if (isFixed(state, cell)) return state;
	const history = [...state.history, { values: state.values, notes: state.notes }];
	const notes = [...state.notes];

	if (state.notesMode) {
		if (state.values[cell]) return state;
		notes[cell] ^= bitOf(digit);
		return { ...state, notes, history };
	}

	if (state.values[cell] === digit) return state;
	const values = [...state.values];
	values[cell] = digit;
	notes[cell] = 0;

	if (digit !== state.puzzle.solution[cell]) {
		const mistakes = state.mistakes + 1;
		return { ...state, values, notes, history, mistakes, status: mistakes >= MAX_MISTAKES ? "lost" : "playing" };
	}

	for (const peer of PEERS[cell]) notes[peer] &= ~bitOf(digit);
	const won = values.every((value, k) => value === state.puzzle.solution[k]);
	return { ...state, values, notes, history, status: won ? "won" : "playing" };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
	if (action.type === "restart") return createGame(state.puzzle);
	if (state.status !== "playing") return state;
	if (action.type === "togglePause") return { ...state, paused: !state.paused };
	if (state.paused) return state;

	switch (action.type) {
		case "tick":
			return { ...state, elapsed: state.elapsed + 1 };

		case "selectCell":
			return state.lockedDigit === null
				? { ...state, selected: action.cell }
				: enterDigit(state, action.cell, state.lockedDigit);

		case "moveSelection": {
			const from = state.selected ?? 40;
			const row = Math.min(8, Math.max(0, rowOf(from) + action.rows));
			const col = Math.min(8, Math.max(0, colOf(from) + action.cols));
			return { ...state, selected: row * 9 + col, lockedDigit: null };
		}

		case "clearSelection":
			return { ...state, selected: null, lockedDigit: null };

		case "pressDigit":
			if (state.lockedDigit !== null) {
				return { ...state, lockedDigit: state.lockedDigit === action.digit ? null : action.digit };
			}
			if (state.selected !== null && !isFixed(state, state.selected)) {
				return enterDigit(state, state.selected, action.digit);
			}
			return { ...state, selected: null, lockedDigit: action.digit };

		case "lockDigit":
			return { ...state, selected: null, lockedDigit: action.digit };

		case "erase": {
			const cell = state.selected;
			if (cell === null || isFixed(state, cell) || (!state.values[cell] && !state.notes[cell])) return state;
			const values = [...state.values];
			const notes = [...state.notes];
			values[cell] = 0;
			notes[cell] = 0;
			return {
				...state,
				values,
				notes,
				history: [...state.history, { values: state.values, notes: state.notes }],
			};
		}

		case "undo": {
			const previous = state.history.at(-1);
			if (!previous) return state;
			return { ...state, ...previous, history: state.history.slice(0, -1) };
		}

		case "toggleNotes":
			return { ...state, notesMode: !state.notesMode };
	}
}
