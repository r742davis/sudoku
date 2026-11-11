"use client";

import { useCallback } from "react";
import { useSudokuGame } from "@/hooks/useSudokuGame";
import { useSudokuKeyboard } from "@/hooks/useSudokuKeyboard";
import { MAX_MISTAKES, type Difficulty, type GameState } from "@/lib/sudoku/types";
import { Actions } from "./Actions";
import { BoardOverlay, OverlayButton } from "./BoardOverlay";
import { BoardSection } from "./BoardSection";
import { Header } from "./Header";
import { Numbers } from "./Numbers";

export function SudokuGame() {
	const { game, pending, dispatch, newGame } = useSudokuGame();
	useSudokuKeyboard(dispatch);

	const selectCell = useCallback((cell: number) => dispatch({ type: "selectCell", cell }), [dispatch]);
	const pressDigit = useCallback((digit: number) => dispatch({ type: "pressDigit", digit }), [dispatch]);
	const lockDigit = useCallback((digit: number) => dispatch({ type: "lockDigit", digit }), [dispatch]);

	if (!game) {
		return <p className='py-24 text-center text-muted'>Building your puzzle…</p>;
	}

	const overlay = renderOverlay(game, pending, {
		resume: () => dispatch({ type: "togglePause" }),
		restart: () => dispatch({ type: "restart" }),
		newGame: () => newGame(game.puzzle.difficulty),
	});

	return (
		<main className='mx-auto flex max-w-4xl touch-manipulation select-none flex-col gap-5 px-3 py-4 md:flex-row md:items-start md:justify-center md:gap-10 md:py-10'>
			<div className='flex w-full flex-col gap-3 md:max-w-[32rem]'>
				<Header
					startedOn={game.startedOn}
					difficulty={pending ?? game.puzzle.difficulty}
					mistakes={game.mistakes}
					elapsed={game.elapsed}
					paused={game.paused}
					onDifficultyChange={newGame}
					onTogglePause={() => dispatch({ type: "togglePause" })}
				/>
				<BoardSection game={game} overlay={overlay} onSelectCell={selectCell} />
			</div>

			<div className='flex flex-col gap-5 md:w-64 md:pt-14'>
				<Actions
					canUndo={game.history.length > 0}
					notesMode={game.notesMode}
					onUndo={() => dispatch({ type: "undo" })}
					onErase={() => dispatch({ type: "erase" })}
					onToggleNotes={() => dispatch({ type: "toggleNotes" })}
				/>
				<Numbers
					values={game.values}
					solution={game.puzzle.solution}
					lockedDigit={game.lockedDigit}
					notesMode={game.notesMode}
					onPress={pressDigit}
					onHold={lockDigit}
				/>
				<button
					type='button'
					onClick={() => newGame(game.puzzle.difficulty)}
					className='mx-auto rounded-full border border-line px-5 py-2 font-medium text-muted outline-accent focus-visible:outline-2 md:w-full'>
					New game
				</button>
			</div>
		</main>
	);
}

interface OverlayHandlers {
	resume: () => void;
	restart: () => void;
	newGame: () => void;
}

function renderOverlay(game: GameState, pending: Difficulty | null, on: OverlayHandlers) {
	if (pending) return <BoardOverlay title={`Building ${pending} puzzle…`} />;

	if (game.status === "won") {
		const minutes = Math.floor(game.elapsed / 60);
		const seconds = String(game.elapsed % 60).padStart(2, "0");
		return (
			<BoardOverlay
				title='Solved'
				detail={`You finished the ${game.puzzle.difficulty} puzzle in ${minutes}:${seconds}.`}>
				<OverlayButton primary onClick={on.newGame}>
					New game
				</OverlayButton>
			</BoardOverlay>
		);
	}

	if (game.status === "lost") {
		return (
			<BoardOverlay title='Game over' detail={`You made ${MAX_MISTAKES} mistakes on this puzzle.`}>
				<OverlayButton onClick={on.restart}>Try again</OverlayButton>
				<OverlayButton primary onClick={on.newGame}>
					New game
				</OverlayButton>
			</BoardOverlay>
		);
	}

	if (game.paused) {
		return (
			<BoardOverlay title='Paused'>
				<OverlayButton primary onClick={on.resume}>
					Resume
				</OverlayButton>
			</BoardOverlay>
		);
	}

	return null;
}
