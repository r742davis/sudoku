const SWATCHES = [
	{ tone: "base", label: "Pattern cell" },
	{ tone: "pin", label: "Pincer or link end" },
	{ tone: "fin", label: "Fin" },
	{ tone: "elim", label: "Candidate removed" },
];

export function DiagramLegend() {
	return (
		<ul className='flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted'>
			{SWATCHES.map(({ tone, label }) => (
				<li key={tone} className='flex items-center gap-1.5'>
					<span
						className='size-4 rounded border-[1.5px]'
						style={{ background: `var(--tone-${tone}-soft)`, borderColor: `var(--tone-${tone})` }}
					/>
					{label}
				</li>
			))}
			<li className='flex items-center gap-1.5'>
				<span className='w-6 border-t-2 border-ink' />
				Strong link
			</li>
			<li className='flex items-center gap-1.5'>
				<span className='w-6 border-t-2 border-dashed border-ink' />
				Weak link
			</li>
		</ul>
	);
}
