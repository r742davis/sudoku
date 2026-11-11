"use client";

import { useEffect } from "react";
import type { GameAction } from "@/lib/sudoku/game";

const KEYS: Record<string, GameAction> = {
	ArrowUp: { type: "moveSelection", rows: -1, cols: 0 },
	ArrowDown: { type: "moveSelection", rows: 1, cols: 0 },
	ArrowLeft: { type: "moveSelection", rows: 0, cols: -1 },
	ArrowRight: { type: "moveSelection", rows: 0, cols: 1 },
	Backspace: { type: "erase" },
	Delete: { type: "erase" },
	Escape: { type: "clearSelection" },
	n: { type: "toggleNotes" },
	u: { type: "undo" },
	p: { type: "togglePause" },
};

/** Desktop controls: arrows move, 1-9 enter, Backspace erases, N notes, U undo, P pause. */
export function useSudokuKeyboard(dispatch: (action: GameAction) => void) {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey || event.target instanceof HTMLSelectElement) return;
			const action: GameAction | undefined = /^[1-9]$/.test(event.key)
				? { type: "pressDigit", digit: Number(event.key) }
				: KEYS[event.key];
			if (!action) return;
			event.preventDefault();
			dispatch(action);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [dispatch]);
}
