import { PEERS, bitOf, countBits } from "./grid";

const ALL_DIGITS = 0x1ff;

function openDigits(grid: number[], cell: number) {
	let used = 0;
	for (const peer of PEERS[cell]) if (grid[peer]) used |= bitOf(grid[peer]);
	return ALL_DIGITS & ~used;
}

/** Backtracking search. Calls `onSolution` for each solution until it returns true. */
function search(grid: number[], onSolution: (solution: number[]) => boolean): boolean {
	let best = -1;
	let bestMask = 0;
	let bestCount = 10;
	for (let cell = 0; cell < 81; cell++) {
		if (grid[cell]) continue;
		const mask = openDigits(grid, cell);
		const count = countBits(mask);
		if (count < bestCount) {
			best = cell;
			bestMask = mask;
			bestCount = count;
			if (count <= 1) break;
		}
	}
	if (best < 0) return onSolution(grid);
	for (let digit = 1; digit <= 9; digit++) {
		if (!(bestMask & bitOf(digit))) continue;
		grid[best] = digit;
		if (search(grid, onSolution)) return true;
	}
	grid[best] = 0;
	return false;
}

/** Counts solutions, stopping once `limit` is reached. */
export function countSolutions(givens: number[], limit = 2) {
	let found = 0;
	search([...givens], () => ++found >= limit);
	return found;
}

export function solve(givens: number[]) {
	let solution: number[] = [];
	search([...givens], grid => {
		solution = [...grid];
		return true;
	});
	return solution;
}
