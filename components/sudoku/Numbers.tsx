import { useRef } from "react";

/** How long a number has to be held before bulk edit turns on. */
const HOLD_MS = 400;

interface NumberButtonProps {
	digit: number;
	/** Bulk edit is on and this is the digit it applies. */
	locked: boolean;
	/** Another digit is locked, so this one steps back. */
	dimmed: boolean;
	/** All nine of this digit are placed. */
	complete: boolean;
	notesMode: boolean;
	onPress: (digit: number) => void;
	onHold: (digit: number) => void;
}

function NumberButton({ digit, locked, dimmed, complete, notesMode, onPress, onHold }: NumberButtonProps) {
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const held = useRef(false);

	const startHold = () => {
		held.current = false;
		timer.current = setTimeout(() => {
			held.current = true;
			onHold(digit);
		}, HOLD_MS);
	};
	const cancelHold = () => clearTimeout(timer.current);

	// The click that ends a hold must not also count as a press.
	const handleClick = () => {
		if (!held.current) onPress(digit);
		held.current = false;
	};

	return (
		<button
			type='button'
			onClick={handleClick}
			onPointerDown={startHold}
			onPointerUp={cancelHold}
			onPointerLeave={cancelHold}
			onPointerCancel={cancelHold}
			onContextMenu={event => event.preventDefault()}
			disabled={complete}
			aria-pressed={locked}
			aria-label={locked ? `${digit}, bulk edit on` : String(digit)}
			className={`relative grid place-items-center rounded-xl py-2 text-4xl leading-none outline-accent transition-opacity [-webkit-touch-callout:none] focus-visible:outline-2 enabled:active:bg-peer disabled:invisible md:aspect-square md:text-3xl ${
				notesMode ? "text-ink" : "text-accent"
			} ${locked ? "bg-selected ring-2 ring-accent" : "md:bg-surface"} ${dimmed ? "opacity-35" : ""}`}>
			{locked && <span className='absolute -top-1 size-2 rounded-full bg-accent ring-2 ring-page' />}
			{digit}
		</button>
	);
}

interface NumbersProps {
	values: number[];
	solution: number[];
	lockedDigit: number | null;
	notesMode: boolean;
	onPress: (digit: number) => void;
	onHold: (digit: number) => void;
}

export function Numbers({ values, solution, lockedDigit, notesMode, onPress, onHold }: NumbersProps) {
	const placed = new Array<number>(10).fill(0);
	values.forEach((value, cell) => {
		if (value === solution[cell]) placed[value]++;
	});

	return (
		<div className='flex flex-col gap-2'>
			<div className='grid grid-cols-9 gap-0.5 md:grid-cols-3 md:gap-2'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
					<NumberButton
						key={digit}
						digit={digit}
						locked={lockedDigit === digit}
						dimmed={lockedDigit !== null && lockedDigit !== digit}
						complete={placed[digit] === 9}
						notesMode={notesMode}
						onPress={onPress}
						onHold={onHold}
					/>
				))}
			</div>
			<p className='min-h-5 text-center text-sm text-muted' aria-live='polite'>
				{lockedDigit !== null &&
					`Bulk edit: tap cells to ${notesMode ? "note" : "place"} ${lockedDigit}. Tap ${lockedDigit} again to stop.`}
			</p>
		</div>
	);
}
