import { memo } from "react";
import { bitOf, colOf, rowOf } from "@/lib/sudoku/grid";

export type CellTone = "selected" | "match" | "peer" | "plain";

const TONES: Record<CellTone, string> = {
	selected: "bg-selected",
	match: "bg-match",
	peer: "bg-peer",
	plain: "bg-surface",
};

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Thin lines between cells, heavy lines between boxes. Shared with the practice board. */
export function cellBorders(cell: number) {
	const row = rowOf(cell);
	const col = colOf(cell);
	return [
		col === 8 ? "" : col % 3 === 2 ? "border-r-2 border-r-line-strong" : "border-r border-r-line",
		row === 8 ? "" : row % 3 === 2 ? "border-b-2 border-b-line-strong" : "border-b border-b-line",
	].join(" ");
}

interface BoardCellProps {
	cell: number;
	value: number;
	notes: number;
	given: boolean;
	wrong: boolean;
	tone: CellTone;
	highlightDigit: number;
	onSelect: (cell: number) => void;
}

function BoardCellBase({ cell, value, notes, given, wrong, tone, highlightDigit, onSelect }: BoardCellProps) {
	const ink = wrong ? "text-danger" : given ? "text-ink" : "text-accent";

	return (
		<button
			type='button'
			onClick={() => onSelect(cell)}
			aria-label={`Row ${rowOf(cell) + 1}, column ${colOf(cell) + 1}${value ? `, ${value}` : ", empty"}`}
			className={`relative grid min-w-0 place-items-center outline-none ${cellBorders(cell)} ${TONES[tone]}`}>
			{value ? (
				<span className={`text-[7cqw] leading-none ${ink}`}>{value}</span>
			) : (
				<span className='grid size-full grid-cols-3 grid-rows-3 p-[0.4cqw]'>
					{DIGITS.map(digit => (
						<span
							key={digit}
							className={`grid place-items-center text-[2.7cqw] leading-none ${
								digit === highlightDigit ? "font-bold text-ink" : "text-muted"
							}`}>
							{notes & bitOf(digit) ? digit : ""}
						</span>
					))}
				</span>
			)}
		</button>
	);
}

export const BoardCell = memo(BoardCellBase);
