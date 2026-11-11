import type { ReactNode } from "react";
import { PEERS } from "@/lib/sudoku/grid";
import type { GameState } from "@/lib/sudoku/types";
import { BoardCell, type CellTone } from "./BoardCell";

interface BoardSectionProps {
	game: GameState;
	/** Covers the grid, for the pause, win and game-over screens. */
	overlay?: ReactNode;
	onSelectCell: (cell: number) => void;
}

export function BoardSection({ game, overlay, onSelectCell }: BoardSectionProps) {
	const { values, notes, selected, lockedDigit, puzzle } = game;
	const highlightDigit = lockedDigit ?? (selected === null ? 0 : values[selected]);
	const peers = selected === null ? [] : PEERS[selected];

	const toneOf = (cell: number): CellTone => {
		if (cell === selected) return "selected";
		if (highlightDigit && values[cell] === highlightDigit) return "match";
		if (peers.includes(cell)) return "peer";
		return "plain";
	};

	return (
		<section className='relative aspect-square w-full overflow-hidden rounded-sm border-2 border-line-strong [container-type:inline-size]'>
			<div className='grid size-full grid-cols-9 grid-rows-9' role='grid' aria-label='Sudoku board'>
				{values.map((value, cell) => (
					<BoardCell
						key={cell}
						cell={cell}
						value={overlay ? 0 : value}
						notes={overlay ? 0 : notes[cell]}
						given={puzzle.givens[cell] !== 0}
						wrong={value !== 0 && value !== puzzle.solution[cell]}
						tone={overlay ? "plain" : toneOf(cell)}
						highlightDigit={highlightDigit}
						onSelect={onSelectCell}
					/>
				))}
			</div>
			{overlay}
		</section>
	);
}
