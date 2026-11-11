const range9 = Array.from({ length: 9 }, (_, k) => k);

export const rowOf = (cell: number) => Math.floor(cell / 9);
export const colOf = (cell: number) => cell % 9;
export const boxOf = (cell: number) => Math.floor(cell / 27) * 3 + Math.floor((cell % 9) / 3);

export const ROWS = range9.map(r => range9.map(c => r * 9 + c));
export const COLS = range9.map(c => range9.map(r => r * 9 + c));
export const BOXES = range9.map(b =>
	range9.map(k => (Math.floor(b / 3) * 3 + Math.floor(k / 3)) * 9 + (b % 3) * 3 + (k % 3))
);
export const UNITS = [...ROWS, ...COLS, ...BOXES];

export const PEERS = Array.from({ length: 81 }, (_, cell) =>
	Array.from({ length: 81 }, (_, other) => other).filter(
		other =>
			other !== cell &&
			(rowOf(other) === rowOf(cell) || colOf(other) === colOf(cell) || boxOf(other) === boxOf(cell))
	)
);

export const bitOf = (digit: number) => 1 << (digit - 1);

export function countBits(mask: number) {
	let count = 0;
	for (let m = mask; m; m &= m - 1) count++;
	return count;
}
