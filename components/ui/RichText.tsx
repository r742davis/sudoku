/** Renders lesson text: {r2c3} becomes a cell reference chip and *text* becomes emphasis. */
export function RichText({ text }: { text: string }) {
	const parts = text.split(/(\{r\dc\d\}|\*[^*]+\*)/g);
	return (
		<>
			{parts.map((part, k) => {
				if (/^\{r\dc\d\}$/.test(part)) {
					return (
						<code key={k} className='rounded bg-peer px-1 py-0.5 font-mono text-[0.85em] whitespace-nowrap'>
							{part.slice(1, -1)}
						</code>
					);
				}
				if (part.startsWith("*")) return <em key={k}>{part.slice(1, -1)}</em>;
				return part;
			})}
		</>
	);
}
