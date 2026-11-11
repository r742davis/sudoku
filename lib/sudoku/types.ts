export type Difficulty = "easy" | "medium" | "hard" | "expert" | "extreme";

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "expert", "extreme"];

export const MAX_MISTAKES = 3;

export interface Puzzle {
	difficulty: Difficulty;
	/** 81 digits, row by row. 0 means empty. */
	givens: number[];
	solution: number[];
}

export interface Snapshot {
	values: number[];
	notes: number[];
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
	puzzle: Puzzle;
	values: number[];
	/** One 9-bit mask per cell. Bit (d - 1) is set when digit d is pencilled in. */
	notes: number[];
	selected: number | null;
	/** Number-first input: the digit that gets applied to every cell you tap. */
	lockedDigit: number | null;
	notesMode: boolean;
	mistakes: number;
	elapsed: number;
	paused: boolean;
	status: GameStatus;
	history: Snapshot[];
	startedOn: string;
}
