import type { CellRole, Diagram } from "@/lib/learn/types";

const CELL = 34;
const PAD = 20;
const SIZE = 9 * CELL;

const ROLE_TONE: Record<CellRole, string> = {
	base: "base",
	pin: "pin",
	fin: "fin",
	elim: "elim",
	a: "pin",
	b: "alt",
	solve: "solve",
};

function position(name: string) {
	return { row: Number(name[1]) - 1, col: Number(name[3]) - 1 };
}

function center(name: string) {
	const { row, col } = position(name);
	return { x: PAD + col * CELL + CELL / 2, y: PAD + row * CELL + CELL / 2 };
}

export function TechniqueDiagram({ diagram, label }: { diagram: Diagram; label: string }) {
	const cells = Object.entries(diagram.cells).map(([name, spec]) => {
		const [digits, role] = spec.split("|") as [string, CellRole | undefined];
		return { name, digits, tone: role ? ROLE_TONE[role] : undefined, eliminated: role === "elim" };
	});
	const lines = [1, 2, 3, 4, 5, 6, 7, 8];

	return (
		<svg
			viewBox={`0 0 ${PAD + SIZE + 4} ${PAD + SIZE + 4}`}
			role='img'
			aria-label={label}
			className='h-auto w-full max-w-sm'>
			<rect x={PAD} y={PAD} width={SIZE} height={SIZE} fill='var(--surface)' />

			{diagram.boxes?.map(box => (
				<rect
					key={`box${box}`}
					x={PAD + ((box - 1) % 3) * 3 * CELL}
					y={PAD + Math.floor((box - 1) / 3) * 3 * CELL}
					width={3 * CELL}
					height={3 * CELL}
					fill='var(--peer)'
				/>
			))}
			{diagram.bands?.map(band => {
				const offset = PAD + (Number(band[1]) - 1) * CELL;
				return band[0] === "r" ? (
					<rect key={band} x={PAD} y={offset} width={SIZE} height={CELL} fill='var(--peer)' />
				) : (
					<rect key={band} x={offset} y={PAD} width={CELL} height={SIZE} fill='var(--peer)' />
				);
			})}

			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => (
				<text
					key={`c${k}`}
					x={PAD + (k - 1) * CELL + CELL / 2}
					y={PAD - 7}
					textAnchor='middle'
					fontSize={9}
					fill='var(--muted)'
					className='font-mono'>
					c{k}
				</text>
			))}
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => (
				<text
					key={`r${k}`}
					x={PAD - 4}
					y={PAD + (k - 1) * CELL + CELL / 2 + 3}
					textAnchor='end'
					fontSize={9}
					fill='var(--muted)'
					className='font-mono'>
					r{k}
				</text>
			))}

			{cells.map(({ name, tone }) => {
				if (!tone) return null;
				const { row, col } = position(name);
				return (
					<rect
						key={name}
						x={PAD + col * CELL + 2.5}
						y={PAD + row * CELL + 2.5}
						width={CELL - 5}
						height={CELL - 5}
						rx={4}
						fill={`var(--tone-${tone}-soft)`}
						stroke={`var(--tone-${tone})`}
						strokeWidth={1.5}
					/>
				);
			})}

			{lines.map(k => {
				const at = PAD + k * CELL;
				const heavy = k % 3 === 0;
				const stroke = heavy ? "var(--line-strong)" : "var(--line)";
				return (
					<g key={k} stroke={stroke} strokeWidth={heavy ? 2 : 0.75}>
						<line x1={at} y1={PAD} x2={at} y2={PAD + SIZE} />
						<line x1={PAD} y1={at} x2={PAD + SIZE} y2={at} />
					</g>
				);
			})}
			<rect
				x={PAD}
				y={PAD}
				width={SIZE}
				height={SIZE}
				fill='none'
				stroke='var(--line-strong)'
				strokeWidth={2.5}
			/>

			{diagram.links?.map(([from, to, kind]) => {
				const a = center(from);
				const b = center(to);
				// Stop each line short of the cell centers so it doesn't cross the digits.
				const trim = 12 / Math.hypot(b.x - a.x, b.y - a.y);
				return (
					<line
						key={`${from}${to}`}
						x1={a.x + (b.x - a.x) * trim}
						y1={a.y + (b.y - a.y) * trim}
						x2={b.x - (b.x - a.x) * trim}
						y2={b.y - (b.y - a.y) * trim}
						stroke='var(--ink)'
						strokeWidth={2.2}
						strokeLinecap='round'
						strokeDasharray={kind === "w" ? "4 4" : undefined}
					/>
				);
			})}

			{cells.map(({ name, digits, tone, eliminated }) => {
				const { x, y } = center(name);
				const size = digits.length > 2 ? 11 : digits.length === 2 ? 13 : 16;
				return (
					<g key={`t${name}`}>
						<text
							x={x}
							y={y + size * 0.36}
							textAnchor='middle'
							fontSize={size}
							fontWeight={700}
							fill={tone ? `var(--tone-${tone})` : "var(--muted)"}>
							{digits}
						</text>
						{eliminated && (
							<line
								x1={x - 8}
								y1={y + 6}
								x2={x + 8}
								y2={y - 6}
								stroke='var(--tone-elim)'
								strokeWidth={2}
							/>
						)}
					</g>
				);
			})}
		</svg>
	);
}
