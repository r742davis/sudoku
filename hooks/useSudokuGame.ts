"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { createGame, gameReducer, type GameAction } from "@/lib/sudoku/game";
import { loadDifficulty, loadGame, saveGame } from "@/lib/sudoku/storage";
import type { Difficulty, GameState, Puzzle } from "@/lib/sudoku/types";

interface Store {
	game: GameState | null;
	/** Difficulty of the puzzle being generated, if any. */
	pending: Difficulty | null;
}

type StoreAction =
	| GameAction
	| { type: "request"; difficulty: Difficulty }
	| { type: "start"; puzzle: Puzzle }
	| { type: "resume"; game: GameState };

function storeReducer(store: Store, action: StoreAction): Store {
	switch (action.type) {
		case "request":
			return { ...store, pending: action.difficulty };
		case "start":
			return { game: createGame(action.puzzle), pending: null };
		case "resume":
			return { game: action.game, pending: null };
		default:
			return store.game ? { ...store, game: gameReducer(store.game, action) } : store;
	}
}

export function useSudokuGame(defaultDifficulty: Difficulty = "medium") {
	const [{ game, pending }, dispatch] = useReducer(storeReducer, { game: null, pending: defaultDifficulty });
	const worker = useRef<Worker | null>(null);

	const newGame = useCallback((difficulty: Difficulty) => {
		dispatch({ type: "request", difficulty });
		worker.current?.postMessage(difficulty);
	}, []);

	// Puzzles are generated off the main thread so the page never freezes.
	useEffect(() => {
		const generator = new Worker(new URL("../lib/sudoku/generator.worker.ts", import.meta.url));
		generator.onmessage = (event: MessageEvent<Puzzle>) => dispatch({ type: "start", puzzle: event.data });
		worker.current = generator;

		const saved = loadGame();
		if (saved) {
			dispatch({ type: "resume", game: saved });
		} else {
			const difficulty = loadDifficulty() ?? defaultDifficulty;
			dispatch({ type: "request", difficulty });
			generator.postMessage(difficulty);
		}

		return () => generator.terminate();
	}, [defaultDifficulty]);

	useEffect(() => {
		if (game) saveGame(game);
	}, [game]);

	const running = game?.status === "playing" && !game.paused;
	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => dispatch({ type: "tick" }), 1000);
		return () => clearInterval(timer);
	}, [running]);

	return { game, pending, dispatch, newGame };
}
