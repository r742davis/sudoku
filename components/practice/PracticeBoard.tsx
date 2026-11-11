import { cellBorders } from "@/components/sudoku/BoardCell";
import { bitOf, colOf, rowOf } from "@/lib/sudoku/grid";
import type { PracticeState } from "@/lib/practice/xwing";

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface PracticeCellProps {
	cell: number;
	state: PracticeState;
	onTap: (cell: number) => void;
}

function PracticeCell({ cell, state, onTap }: PracticeCellProps) {
	const { xwing } = state.board;
	const value = state.values[cell];
	const picked = state.picked.includes(cell);
	const struck = state.phase === "eliminate" && state.removed.includes(cell);
	const inCover = xwing.cross.includes(xwing.kind === "row" ? colOf(cell) : rowOf(cell));

	let tone = "bg-surface";
	if (picked) tone = "bg-selected shadow-[inset_0_0_0_2px_var(--accent)]";
	else if (state.focus === cell) tone = "bg-peer shadow-[inset_0_0_0_2px_var(--accent)]";
	else if (state.phase === "eliminate" && inCover) tone = "bg-peer";

	return (
		<button
			type='button'
			onClick={() => onTap(cell)}
			aria-label={`Row ${rowOf(cell) + 1}, column ${colOf(cell) + 1}${value ? `, ${value}` : ""}`}
			className={`grid min-w-0 place-items-center outline-none ${cellBorders(cell)} ${tone}`}>
			{value ? (
				<span
					className={`text-[7cqw] leading-none ${value === state.highlight ? "font-semibold text-accent" : "text-ink"}`}>
					{value}
				</span>
			) : (
				<span className='grid size-full grid-cols-3 grid-rows-3 p-[0.3cqw]'>
					{DIGITS.map(digit => {
						const removed = struck && digit === xwing.digit;
						const shown = removed || Boolean(state.candidates[cell] & bitOf(digit));
						let look = "text-muted";
						if (removed) look = "text-danger line-through decoration-2";
						else if (digit === state.highlight) look = "rounded-sm bg-accent font-bold text-surface";
						return (
							<span
								key={digit}
								className={`grid place-items-center text-[2.7cqw] leading-none ${shown ? look : ""}`}>
								{shown ? digit : ""}
							</span>
						);
					})}
				</span>
			)}
		</button>
	);
}

export function PracticeBoard({ state, onTap }: { state: PracticeState; onTap: (cell: number) => void }) {
	return (
		<section className='aspect-square w-full overflow-hidden rounded-sm border-2 border-line-strong [container-type:inline-size]'>
			<div className='grid size-full grid-cols-9 grid-rows-9' role='grid' aria-label='Practice board'>
				{state.values.map((_, cell) => (
					<PracticeCell key={cell} cell={cell} state={state} onTap={onTap} />
				))}
			</div>
		</section>
	);
}
