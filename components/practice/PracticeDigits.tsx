interface PracticeDigitsProps {
	/** In the last step the digits enter a value. Before that they highlight a candidate. */
	placing: boolean;
	highlight: number;
	onTap: (digit: number) => void;
}

export function PracticeDigits({ placing, highlight, onTap }: PracticeDigitsProps) {
	return (
		<div className='flex flex-col gap-1.5'>
			<p className='text-xs font-semibold tracking-wide text-muted uppercase'>
				{placing ? "Enter a digit" : "Highlight a digit"}
			</p>
			<div className='grid grid-cols-9 gap-1'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => {
					const active = !placing && highlight === digit;
					return (
						<button
							key={digit}
							type='button'
							onClick={() => onTap(digit)}
							aria-pressed={placing ? undefined : active}
							className={`rounded-lg border py-2 text-xl font-semibold outline-offset-2 outline-accent focus-visible:outline-2 ${
								active ? "border-accent bg-accent text-surface" : "border-line bg-surface text-ink"
							}`}>
							{digit}
						</button>
					);
				})}
			</div>
		</div>
	);
}
