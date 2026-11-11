import { DIFFICULTIES, type Difficulty, type GameState } from "./types";

const KEY = "sudoku:game";
const DIFFICULTY_KEY = "sudoku:difficulty";

export function loadGame(): GameState | null {
	try {
		const saved: GameState | null = JSON.parse(localStorage.getItem(KEY) ?? "null");
		return saved?.puzzle?.givens?.length === 81 && saved.values?.length === 81 ? saved : null;
	} catch {
		return null;
	}
}

export function saveGame(game: GameState) {
	try {
		localStorage.setItem(KEY, JSON.stringify(game));
	} catch {
		// Private windows can refuse storage. The game still works, it just won't resume.
	}
}

/** Drops the saved game so the next visit to /play starts a fresh puzzle at this difficulty. */
export function startFresh(difficulty: Difficulty) {
	try {
		localStorage.removeItem(KEY);
		localStorage.setItem(DIFFICULTY_KEY, difficulty);
	} catch {
		// Without storage, /play falls back to its default difficulty.
	}
}

export function loadDifficulty(): Difficulty | null {
	try {
		const saved = localStorage.getItem(DIFFICULTY_KEY);
		return DIFFICULTIES.find(difficulty => difficulty === saved) ?? null;
	} catch {
		return null;
	}
}
